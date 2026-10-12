package models

import (
	"time"

	"github.com/google/uuid"
)

type CoupleLinkStatus string

const (
	Pending   CoupleLinkStatus = "PENDING"
	Accepted  CoupleLinkStatus = "ACCEPTED"
	Rejected  CoupleLinkStatus = "REJECTED"
	Cancelled CoupleLinkStatus = "CANCELLED"
	Unlinked  CoupleLinkStatus = "UNLINKED"
)

type CoupleLink struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	RequesterID uuid.UUID `gorm:"type:uuid;not null"`
	PartnerID   uuid.UUID `gorm:"type:uuid;not null"`
	Status      CoupleLinkStatus `gorm:"type:varchar(20);default:'PENDING'"`
	
	RespondedAt *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time

	Requester User `gorm:"foreignKey:RequesterID"`
	Partner   User `gorm:"foreignKey:PartnerID"`
}
