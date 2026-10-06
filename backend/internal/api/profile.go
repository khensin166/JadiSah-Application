package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
	"github.com/khensin166/JadiSah-Application/backend/internal/models"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

// GetMyProfile implements apigen.ServerInterface.
func (s *Server) GetMyProfile(c *gin.Context) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	// 2. Fetch user profile from database with roles
	var user models.User
	if err := s.db.Preload("Roles.Permissions").First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, apigen.NotFound{Message: "user not found"})
		return
	}

	// 3. Map Roles and Permissions
	roles := make([]apigen.RoleName, 0)
	permissionsMap := make(map[string]bool)
	for _, role := range user.Roles {
		roles = append(roles, apigen.RoleName(role.Name))
		for _, perm := range role.Permissions {
			permissionsMap[perm.Action] = true
		}
	}

	permissions := make([]string, 0, len(permissionsMap))
	for perm := range permissionsMap {
		permissions = append(permissions, perm)
	}

	// 4. Fetch Partner information (if any)
	var coupleLink models.CoupleLink
	partnerInfo := (*apigen.UserSummary)(nil)

	// Query ACCEPTED links where user is either requester or partner
	err := s.db.Preload("Requester").Preload("Partner").
		Where("(requester_id = ? OR partner_id = ?) AND status = ?", user.ID, user.ID, models.Accepted).
		First(&coupleLink).Error

	if err == nil { // Found a partner
		var partner models.User
		if coupleLink.RequesterID == user.ID {
			partner = coupleLink.Partner
		} else {
			partner = coupleLink.Requester
		}
		partnerInfo = &apigen.UserSummary{
			Id:        partner.ID,
			Email:     openapi_types.Email(partner.Email),
			FirstName: partner.FirstName,
			LastName:  partner.LastName,
		}
	}

	// 5. Construct Profile Response
	profile := apigen.Profile{
		Id:                    user.ID,
		Email:                 openapi_types.Email(user.Email),
		FirstName:             user.FirstName,
		LastName:              user.LastName,
		CreatedAt:             user.CreatedAt,
		SubscriptionTier:      apigen.SubscriptionTier(user.SubscriptionTier),
		SubscriptionExpiresAt: user.SubscriptionExpiresAt,
		Roles:                 roles,
		Permissions:           permissions,
		Partner:               partnerInfo,
	}

	if user.EmailVerifiedAt != nil {
		verified := true
		profile.EmailVerified = &verified
	} else {
		verified := false
		profile.EmailVerified = &verified
	}

	c.JSON(http.StatusOK, profile)
}

// UpdateMyProfile implements apigen.ServerInterface.
func (s *Server) UpdateMyProfile(c *gin.Context) {
	userID, ok := s.authenticate(c)
	if !ok {
		return
	}

	// 2. Parse Request Body
	var req apigen.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "invalid request body"})
		return
	}

	// 3. Update Database
	updates := map[string]interface{}{}
	if req.FirstName != nil {
		updates["first_name"] = *req.FirstName
	}
	if req.LastName != nil {
		updates["last_name"] = *req.LastName
	}

	if len(updates) > 0 {
		if err := s.db.Model(&models.User{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to update profile"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "profile updated"})
}
