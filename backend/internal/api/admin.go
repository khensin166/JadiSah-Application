package api

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
	"github.com/khensin166/JadiSah-Application/backend/internal/models"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"gorm.io/gorm"
)

const (
	defaultPerPage = 20
	maxPerPage     = 100
	roleSuperAdmin = "SUPER_ADMIN"
)

func toAdminUser(u models.User) apigen.AdminUser {
	roles := make([]apigen.RoleName, 0, len(u.Roles))
	for _, r := range u.Roles {
		roles = append(roles, apigen.RoleName(r.Name))
	}
	return apigen.AdminUser{
		Id:                    u.ID,
		Email:                 openapi_types.Email(u.Email),
		FirstName:             u.FirstName,
		LastName:              u.LastName,
		CreatedAt:             u.CreatedAt,
		Roles:                 roles,
		SubscriptionTier:      apigen.SubscriptionTier(u.SubscriptionTier),
		SubscriptionExpiresAt: u.SubscriptionExpiresAt,
	}
}

// AdminListRoles implements apigen.ServerInterface.
func (s *Server) AdminListRoles(c *gin.Context) {
	if _, ok := s.authorize(c, "roles:read"); !ok {
		return
	}

	var roles []models.Role
	if err := s.db.Preload("Permissions").Order("name").Find(&roles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to fetch roles"})
		return
	}

	resp := make([]apigen.Role, 0, len(roles))
	for _, r := range roles {
		perms := make([]string, 0, len(r.Permissions))
		for _, p := range r.Permissions {
			perms = append(perms, p.Action)
		}
		desc := r.Description
		resp = append(resp, apigen.Role{
			Name:        apigen.RoleName(r.Name),
			Description: &desc,
			Permissions: perms,
		})
	}

	c.JSON(http.StatusOK, resp)
}

// AdminListUsers implements apigen.ServerInterface.
func (s *Server) AdminListUsers(c *gin.Context, params apigen.AdminListUsersParams) {
	if _, ok := s.authorize(c, "users:read"); !ok {
		return
	}

	page := 1
	if params.Page != nil && *params.Page > 0 {
		page = *params.Page
	}
	perPage := defaultPerPage
	if params.PerPage != nil && *params.PerPage > 0 {
		perPage = min(*params.PerPage, maxPerPage)
	}

	query := s.db.Model(&models.User{})
	if params.Q != nil && strings.TrimSpace(*params.Q) != "" {
		like := "%" + strings.TrimSpace(*params.Q) + "%"
		query = query.Where("email ILIKE ? OR first_name ILIKE ? OR last_name ILIKE ?", like, like, like)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to count users"})
		return
	}

	var users []models.User
	err := query.Preload("Roles").
		Order("created_at DESC").
		Offset((page - 1) * perPage).
		Limit(perPage).
		Find(&users).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to fetch users"})
		return
	}

	items := make([]apigen.AdminUser, 0, len(users))
	for _, u := range users {
		items = append(items, toAdminUser(u))
	}

	c.JSON(http.StatusOK, apigen.AdminUserPage{
		Items:   items,
		Page:    page,
		PerPage: perPage,
		Total:   total,
	})
}

// AdminSetUserRoles implements apigen.ServerInterface.
func (s *Server) AdminSetUserRoles(c *gin.Context, userId apigen.UserId) {
	actorID, ok := s.authorize(c, "roles:assign")
	if !ok {
		return
	}

	var req apigen.SetUserRolesRequest
	if err := c.ShouldBindJSON(&req); err != nil || len(req.Roles) == 0 {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "roles must be a non-empty array"})
		return
	}

	names := make([]string, 0, len(req.Roles))
	seen := make(map[string]bool)
	for _, r := range req.Roles {
		n := string(r)
		if !seen[n] {
			seen[n] = true
			names = append(names, n)
		}
	}

	// Guard: SUPER_ADMIN tidak boleh mencabut role SUPER_ADMIN miliknya sendiri.
	if userId == actorID && !seen[roleSuperAdmin] {
		c.JSON(http.StatusConflict, apigen.Conflict{Message: "cannot remove SUPER_ADMIN role from yourself"})
		return
	}

	var user models.User
	err := s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.First(&user, "id = ?", userId).Error; err != nil {
			return err
		}

		var roles []models.Role
		if err := tx.Where("name IN ?", names).Find(&roles).Error; err != nil {
			return err
		}
		if len(roles) != len(names) {
			return errUnknownRole
		}

		if err := tx.Model(&user).Association("Roles").Replace(roles); err != nil {
			return err
		}
		return tx.Preload("Roles").First(&user, "id = ?", userId).Error
	})

	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		c.JSON(http.StatusNotFound, apigen.NotFound{Message: "user not found"})
	case errors.Is(err, errUnknownRole):
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "one or more roles do not exist"})
	case err != nil:
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to update roles"})
	default:
		c.JSON(http.StatusOK, toAdminUser(user))
	}
}

var errUnknownRole = errors.New("unknown role")

// AdminSetUserSubscription implements apigen.ServerInterface.
func (s *Server) AdminSetUserSubscription(c *gin.Context, userId apigen.UserId) {
	if _, ok := s.authorize(c, "subscriptions:update"); !ok {
		return
	}

	var req apigen.SetUserSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "invalid request body"})
		return
	}

	tier := models.SubscriptionTier(req.Tier)
	switch tier {
	case models.Free:
		req.ExpiresAt = nil // FREE tidak punya masa berlaku
	case models.Premium, models.VIP:
	default:
		c.JSON(http.StatusBadRequest, apigen.BadRequest{Message: "invalid subscription tier"})
		return
	}

	var user models.User
	if err := s.db.First(&user, "id = ?", userId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, apigen.NotFound{Message: "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to fetch user"})
		return
	}

	err := s.db.Model(&user).Updates(map[string]any{
		"subscription_tier":       tier,
		"subscription_expires_at": req.ExpiresAt,
	}).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to update subscription"})
		return
	}

	if err := s.db.Preload("Roles").First(&user, "id = ?", userId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to reload user"})
		return
	}

	c.JSON(http.StatusOK, toAdminUser(user))
}
