package auth

import (
	"context"

	"github.com/google/uuid"
	"github.com/thecodearcher/limen"
)

type UUIDGenerator struct{}

func (g *UUIDGenerator) GetColumnType() limen.ColumnType {
	return limen.ColumnTypeUUID
}

func (g *UUIDGenerator) Generate(ctx context.Context) (any, error) {
	return uuid.New().String(), nil
}
