package api

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
	"github.com/khensin166/JadiSah-Application/backend/internal/models"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"gorm.io/gorm"
)

func (s *Server) CreateCoupleInvitation(c *gin.Context) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	var req apigen.CreateCoupleInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "invalid request body"})
		return
	}

	// Fetch user to get their email (since we only have userID from authenticate)
	var user models.User
	if err := s.db.Select("email").Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to fetch user"})
		return
	}

	if string(req.PartnerEmail) == user.Email {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "cannot invite yourself"})
		return
	}

	// 1. Find partner by email
	var partner models.User
	if err := s.db.Where("email = ?", req.PartnerEmail).First(&partner).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, apigen.NotFound{Message: "partner email not found"})
		} else {
			c.JSON(http.StatusInternalServerError, apigen.Error{Message: "database error"})
		}
		return
	}

	// 2. Ensure neither user is already in an ACCEPTED couple
	var existingLink int64
	s.db.Model(&models.CoupleLink{}).
		Where("(requester_id = ? OR partner_id = ? OR requester_id = ? OR partner_id = ?) AND status = ?",
			userID, userID, partner.ID, partner.ID, models.Accepted).
		Count(&existingLink)

	if existingLink > 0 {
		c.JSON(http.StatusConflict, apigen.Conflict{Message: "one of the users is already in a couple"})
		return
	}

	// 3. Check for pending invitations between them
	var pendingLink int64
	s.db.Model(&models.CoupleLink{}).
		Where("((requester_id = ? AND partner_id = ?) OR (requester_id = ? AND partner_id = ?)) AND status = ?",
			userID, partner.ID, partner.ID, userID, models.Pending).
		Count(&pendingLink)

	if pendingLink > 0 {
		c.JSON(http.StatusConflict, apigen.Conflict{Message: "pending invitation already exists"})
		return
	}

	// 4. Create Link
	link := models.CoupleLink{
		RequesterID: userID,
		PartnerID:   partner.ID,
		Status:      models.Pending,
	}

	if err := s.db.Create(&link).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to create invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "invitation sent"})
}

func (s *Server) ListCoupleInvitations(c *gin.Context) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	var incoming []models.CoupleLink
	var outgoing []models.CoupleLink

	s.db.Preload("Requester").Preload("Partner").Where("partner_id = ? AND status = ?", userID, models.Pending).Find(&incoming)
	s.db.Preload("Requester").Preload("Partner").Where("requester_id = ? AND status = ?", userID, models.Pending).Find(&outgoing)

	res := apigen.CoupleInvitationList{
		Incoming: make([]apigen.CoupleLink, len(incoming)),
		Outgoing: make([]apigen.CoupleLink, len(outgoing)),
	}

	for i, link := range incoming {
		res.Incoming[i] = mapCoupleLinkToAPI(link)
	}
	for i, link := range outgoing {
		res.Outgoing[i] = mapCoupleLinkToAPI(link)
	}

	c.JSON(http.StatusOK, res)
}

func (s *Server) AcceptCoupleInvitation(c *gin.Context, invitationId apigen.InvitationId) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	var link models.CoupleLink
	if err := s.db.First(&link, "id = ?", invitationId).Error; err != nil {
		c.JSON(http.StatusNotFound, apigen.NotFound{Message: "invitation not found"})
		return
	}

	if link.PartnerID != userID {
		c.JSON(http.StatusForbidden, apigen.Forbidden{Message: "not authorized to accept this invitation"})
		return
	}

	if link.Status != models.Pending {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "invitation is not pending"})
		return
	}

	now := time.Now()
	link.Status = models.Accepted
	link.RespondedAt = &now

	if err := s.db.Save(&link).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to accept invitation"})
		return
	}

	// Cancel any other pending invitations for both users
	s.db.Model(&models.CoupleLink{}).
		Where("(requester_id = ? OR partner_id = ? OR requester_id = ? OR partner_id = ?) AND status = ? AND id != ?",
			link.RequesterID, link.RequesterID, link.PartnerID, link.PartnerID, models.Pending, link.ID).
		Updates(map[string]interface{}{"status": models.Cancelled, "responded_at": now})

	c.JSON(http.StatusOK, gin.H{"message": "invitation accepted"})
}

func (s *Server) RejectCoupleInvitation(c *gin.Context, invitationId apigen.InvitationId) {
	s.updateInvitationStatus(c, invitationId, models.Rejected, false)
}

func (s *Server) CancelCoupleInvitation(c *gin.Context, invitationId apigen.InvitationId) {
	s.updateInvitationStatus(c, invitationId, models.Cancelled, true)
}

func (s *Server) updateInvitationStatus(c *gin.Context, invitationId uuid.UUID, newStatus models.CoupleLinkStatus, isRequester bool) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	var link models.CoupleLink
	if err := s.db.First(&link, "id = ?", invitationId).Error; err != nil {
		c.JSON(http.StatusNotFound, apigen.NotFound{Message: "invitation not found"})
		return
	}

	if isRequester && link.RequesterID != userID {
		c.JSON(http.StatusForbidden, apigen.Forbidden{Message: "not authorized"})
		return
	} else if !isRequester && link.PartnerID != userID {
		c.JSON(http.StatusForbidden, apigen.Forbidden{Message: "not authorized"})
		return
	}

	if link.Status != models.Pending {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "invitation is not pending"})
		return
	}

	now := time.Now()
	link.Status = newStatus
	link.RespondedAt = &now

	if err := s.db.Save(&link).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to update invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (s *Server) GetMyCouple(c *gin.Context) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	var link models.CoupleLink
	if err := s.db.Preload("Requester").Preload("Partner").
		Where("(requester_id = ? OR partner_id = ?) AND status = ?", userID, userID, models.Accepted).
		First(&link).Error; err != nil {
		c.JSON(http.StatusNotFound, apigen.NotFound{Message: "no active couple link"})
		return
	}

	c.JSON(http.StatusOK, mapCoupleLinkToAPI(link))
}

func (s *Server) UnlinkMyCouple(c *gin.Context) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	var link models.CoupleLink
	if err := s.db.Where("(requester_id = ? OR partner_id = ?) AND status = ?", userID, userID, models.Accepted).First(&link).Error; err != nil {
		c.JSON(http.StatusNotFound, apigen.NotFound{Message: "no active couple link"})
		return
	}

	now := time.Now()
	link.Status = models.Unlinked // Added state for unlinked couples
	link.RespondedAt = &now

	if err := s.db.Save(&link).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to unlink couple"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "unlinked successfully"})
}

func mapCoupleLinkToAPI(link models.CoupleLink) apigen.CoupleLink {
	return apigen.CoupleLink{
		Id:          link.ID,
		Status:      apigen.CoupleLinkStatus(link.Status),
		CreatedAt:   link.CreatedAt,
		RespondedAt: link.RespondedAt,
		Requester: apigen.UserSummary{
			Id:        link.Requester.ID,
			Email:     openapi_types.Email(link.Requester.Email),
			FirstName: link.Requester.FirstName,
			LastName:  link.Requester.LastName,
		},
		Partner: apigen.UserSummary{
			Id:        link.Partner.ID,
			Email:     openapi_types.Email(link.Partner.Email),
			FirstName: link.Partner.FirstName,
			LastName:  link.Partner.LastName,
		},
	}
}
