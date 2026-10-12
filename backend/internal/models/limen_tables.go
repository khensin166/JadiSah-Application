package models

import "time"

// LimenSession is a placeholder struct used solely to tell GORM how to
// create the 'sessions' table required by Limen Auth.
type LimenSession struct {
	ID         string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Token      string    `gorm:"type:varchar(255);not null;uniqueIndex"`
	UserID     string    `gorm:"type:uuid;not null;index"`
	CreatedAt  time.Time `gorm:"not null"`
	ExpiresAt  time.Time `gorm:"not null"`
	LastAccess time.Time `gorm:"not null"`
	Metadata   string    `gorm:"type:text"`
}

func (LimenSession) TableName() string {
	return "sessions"
}

// LimenVerification is a placeholder struct used solely to tell GORM how to
// create the 'verifications' table required by Limen Auth.
type LimenVerification struct {
	ID        string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Subject   string    `gorm:"type:varchar(255);not null;index"`
	Value     string    `gorm:"type:varchar(255);not null;uniqueIndex"`
	ExpiresAt time.Time `gorm:"not null"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}

func (LimenVerification) TableName() string {
	return "verifications"
}

// LimenAccount is a placeholder struct used solely to tell GORM how to
// create the 'accounts' table required by Limen Auth (untuk OAuth).
type LimenAccount struct {
	ID                   string     `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID               string     `gorm:"type:uuid;not null;index"`
	Provider             string     `gorm:"type:varchar(255);not null;uniqueIndex:idx_provider_account"`
	ProviderAccountID    string     `gorm:"type:varchar(255);not null;uniqueIndex:idx_provider_account"`
	AccessToken          string     `gorm:"type:text"`
	RefreshToken         string     `gorm:"type:text"`
	AccessTokenExpiresAt *time.Time `gorm:"type:timestamp"`
	Scope                string     `gorm:"type:varchar(255)"`
	IDToken              string     `gorm:"type:text"`
	CreatedAt            time.Time  `gorm:"not null"`
	UpdatedAt            time.Time  `gorm:"not null"`
}

func (LimenAccount) TableName() string {
	return "accounts"
}
