package auth

import (
	"gorm.io/gorm"
	"github.com/thecodearcher/limen"
	limengorm "github.com/thecodearcher/limen/adapters/gorm"
	credentialpassword "github.com/thecodearcher/limen/plugins/credential-password"
)

func InitLimen(db *gorm.DB, secret []byte) (*limen.Limen, error) {
	adapter := limengorm.New(db)

	config := &limen.Config{
		Database: adapter,
		Secret:   secret,
		Schema:   limen.NewDefaultSchemaConfig(), // Using default UUID id generation
		Plugins: []limen.Plugin{
			credentialpassword.New(),
		},
		HTTP: limen.NewDefaultHTTPConfig(limen.WithHTTPBasePath("/api/auth")),
	}

	return limen.New(config)
}
