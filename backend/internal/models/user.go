package models

import (
	"time"

	"github.com/google/uuid"
)

type SubscriptionTier string

const (
	Free    SubscriptionTier = "FREE"
	Premium SubscriptionTier = "PREMIUM"
	VIP     SubscriptionTier = "VIP"
)

// User represents the users table which is also shared with Limen auth.
// Limen expects at least: id, email, password, email_verified_at, created_at, updated_at
type User struct {
	ID                    uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Email                 string    `gorm:"type:varchar(255);uniqueIndex;not null"`
	Password              *string   `gorm:"type:varchar(255)"`
	EmailVerifiedAt       *time.Time
	
	FirstName             *string   `gorm:"type:varchar(255)"`
	LastName              *string   `gorm:"type:varchar(255)"`
	
	SubscriptionTier      SubscriptionTier `gorm:"type:varchar(20);default:'FREE'"`
	SubscriptionExpiresAt *time.Time
	
	CreatedAt             time.Time
	UpdatedAt             time.Time
	
	// Relations
	Roles       []Role       `gorm:"many2many:user_roles;"`
}
