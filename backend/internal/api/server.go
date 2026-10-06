package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
	"github.com/thecodearcher/limen"
	"gorm.io/gorm"
)

type Server struct {
	auth *limen.Limen
	db   *gorm.DB
}

func NewServer(auth *limen.Limen, db *gorm.DB) *Server {
	return &Server{
		auth: auth,
		db:   db,
	}
}

// Admin handlers: see admin.go. Profile: profile.go. Couples: couples.go.

// authenticate validates the Limen session and returns the userID if valid.
// It writes the error response itself and returns ok=false when the request must stop.
func (s *Server) authenticate(c *gin.Context) (uuid.UUID, bool) {
	session, err := s.auth.GetSession(c.Request)
	if err != nil || session == nil || session.User == nil {
		c.JSON(http.StatusUnauthorized, apigen.Unauthorized{Message: "unauthorized"})
		return uuid.Nil, false
	}

	userID, err := uuid.Parse(fmt.Sprint(session.User.ID))
	if err != nil {
		c.JSON(http.StatusUnauthorized, apigen.Unauthorized{Message: "invalid session"})
		return uuid.Nil, false
	}

	return userID, true
}

// authorize validates the Limen session and checks that the user owns the given permission.
func (s *Server) authorize(c *gin.Context, action string) (uuid.UUID, bool) {
	userID, ok := s.authenticate(c)
	if !ok {
		return uuid.Nil, false
	}

	var count int64
	err := s.db.Table("user_roles").
		Joins("JOIN role_permissions ON role_permissions.role_id = user_roles.role_id").
		Joins("JOIN permissions ON permissions.id = role_permissions.permission_id").
		Where("user_roles.user_id = ? AND permissions.action = ?", userID, action).
		Count(&count).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, apigen.Error{Message: "failed to check permission"})
		return uuid.Nil, false
	}
	if count == 0 {
		c.JSON(http.StatusForbidden, apigen.Forbidden{Message: "forbidden"})
		return uuid.Nil, false
	}

	return userID, true
}

// Ping implements apigen.ServerInterface.
func (s *Server) Ping(c *gin.Context) {
	c.JSON(200, apigen.PingResponse{Message: "pong"})
}

// End of server.go
