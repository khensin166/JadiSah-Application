package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	
	"github.com/khensin166/JadiSah-Application/backend/internal/api"
	"github.com/khensin166/JadiSah-Application/backend/internal/auth"
	"github.com/khensin166/JadiSah-Application/backend/internal/db"
	"github.com/khensin166/JadiSah-Application/backend/internal/models"
	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
)

func main() {
	// Initialize database
	database, err := db.Init()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := models.Migrate(database); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	secret := os.Getenv("LIMEN_SECRET")
	if secret == "" {
		secret = "12345678901234567890123456789012" // 32 byte secret for dev
	}

	// Initialize Limen
	limenInstance, err := auth.InitLimen(database, []byte(secret))
	if err != nil {
		log.Fatalf("Failed to initialize limen: %v", err)
	}

	r := gin.Default()

	// Wrap limen http handler for gin
	limenHandler := limenInstance.Handler()
	r.Any("/api/auth/*any", gin.WrapH(limenHandler))

	// Initialize API Server
	apiServer := api.NewServer(limenInstance, database)

	// Register generated handlers
	apigen.RegisterHandlersWithOptions(r, apiServer, apigen.GinServerOptions{
		BaseURL: "",
	})

	log.Println("Starting server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
