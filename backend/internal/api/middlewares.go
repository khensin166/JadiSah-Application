package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
)

// AuthMiddleware checks if the user has a valid Limen session.
func (s *Server) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		session, err := s.auth.GetSession(c.Request)
		if err != nil || session == nil {
			c.JSON(http.StatusUnauthorized, apigen.Unauthorized{
				Message: "unauthorized",
			})
			c.Abort()
			return
		}

		c.Set("user_id", session.User.ID)
		c.Set("session", session)
		c.Next()
	}
}

// RequirePermission checks if the authenticated user has a specific permission.
// Assumes AuthMiddleware has run first.
func (s *Server) RequirePermission(action string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, apigen.Unauthorized{
				Message: "unauthorized",
			})
			c.Abort()
			return
		}

		// Look up user's roles and permissions in the database
		// In a real application, you might cache this or store it in the Limen session directly.
		var count int64
		err := s.db.Table("users").
			Joins("JOIN user_roles ON user_roles.user_id = users.id").
			Joins("JOIN roles ON roles.id = user_roles.role_id").
			Joins("JOIN role_permissions ON role_permissions.role_id = roles.id").
			Joins("JOIN permissions ON permissions.id = role_permissions.permission_id").
			Where("users.id = ? AND permissions.action = ?", userID, action).
			Count(&count).Error

		if err != nil || count == 0 {
			c.JSON(http.StatusForbidden, apigen.Forbidden{
				Message: "forbidden",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
