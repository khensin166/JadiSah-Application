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
		Schema: limen.NewDefaultSchemaConfig(
			limen.WithSchemaIDGenerator(&UUIDGenerator{}),
		), // Using custom UUID generator instead of default BIGINT
		Plugins: []limen.Plugin{
			credentialpassword.New(),
		},
		Session: limen.NewDefaultSessionConfig(
			limen.WithBearerEnabled(),
		),
		HTTP: limen.NewDefaultHTTPConfig(limen.WithHTTPBasePath("/api/auth")),
	}

	return limen.New(config)
}
