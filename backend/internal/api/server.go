package api

import (
	"github.com/gin-gonic/gin"
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

// AdminListRoles implements apigen.ServerInterface.
func (s *Server) AdminListRoles(c *gin.Context) {
	// TODO: implement
}

// AdminListUsers implements apigen.ServerInterface.
func (s *Server) AdminListUsers(c *gin.Context, params apigen.AdminListUsersParams) {
	// TODO: implement
}

// AdminSetUserRoles implements apigen.ServerInterface.
func (s *Server) AdminSetUserRoles(c *gin.Context, userId apigen.UserId) {
	// TODO: implement
}

// AdminSetUserSubscription implements apigen.ServerInterface.
func (s *Server) AdminSetUserSubscription(c *gin.Context, userId apigen.UserId) {
	// TODO: implement
}

// Ping implements apigen.ServerInterface.
func (s *Server) Ping(c *gin.Context) {
	c.JSON(200, apigen.PingResponse{Message: "pong"})
}

// End of server.go
