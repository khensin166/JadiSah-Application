package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	apigen "github.com/khensin166/JadiSah-Application/backend/generated/api"
	"github.com/khensin166/JadiSah-Application/backend/internal/api"
	"github.com/khensin166/JadiSah-Application/backend/internal/auth"
	"github.com/khensin166/JadiSah-Application/backend/internal/db"
	"github.com/khensin166/JadiSah-Application/backend/internal/logger"
	"github.com/khensin166/JadiSah-Application/backend/internal/models"
)

func main() {
	// 1. Multi-path .env load (mendukung eksekusi dari root, backend/, atau backend/cmd/server/)
	_ = godotenv.Load(".env", "../.env", "../../.env")

	// 2. Inisialisasi Structured JSON Logger
	log := logger.Init()
	log.Info("Starting JadiSah backend service initialization...")

	// 3. Initialize database
	database, err := db.Init()
	if err != nil {
		log.Error("Failed to initialize database connection", "error", map[string]any{
			"type":  "DatabaseConnectionError",
			"stack": err.Error(),
		})
		os.Exit(1)
	}
	log.Info("Database connection established successfully")

	if err := models.Migrate(database); err != nil {
		log.Error("Failed to migrate database schema", "error", map[string]any{
			"type":  "DatabaseMigrationError",
			"stack": err.Error(),
		})
		os.Exit(1)
	}
	log.Info("Database schema migration completed")

	// 4. Seed Default Data
	if err := db.SeedRolesAndPermissions(database); err != nil {
		log.Error("Failed to seed database roles and permissions", "error", map[string]any{
			"type":  "DatabaseSeederError",
			"stack": err.Error(),
		})
		os.Exit(1)
	}

	secret := os.Getenv("LIMEN_SECRET")
	if secret == "" {
		secret = "12345678901234567890123456789012" // 32 byte secret for dev
	}

	// 5. Initialize Limen
	limenInstance, err := auth.InitLimen(database, []byte(secret))
	if err != nil {
		log.Error("Failed to initialize Limen authentication", "error", map[string]any{
			"type":  "AuthInitError",
			"stack": err.Error(),
		})
		os.Exit(1)
	}

	// 6. Router Setup with Structured JSON Logger & Panic Recovery
	gin.SetMode(gin.ReleaseMode)
	if os.Getenv("GIN_MODE") == "debug" {
		gin.SetMode(gin.DebugMode)
	}

	r := gin.New()
	r.Use(logger.Middleware())
	r.Use(logger.Recovery())

	// CORS Setup
	r.Use(cors.New(cors.Config{
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "Accept", "X-Request-ID"},
		ExposeHeaders:    []string{"Set-Cookie", "Set-Auth-Token", "X-Request-ID"},
		AllowCredentials: true,
	}))

	// Wrap limen http handler for gin
	limenHandler := limenInstance.Handler()
	r.Any("/api/auth/*any", gin.WrapH(limenHandler))

	// Initialize API Server
	apiServer := api.NewServer(limenInstance, database)

	// Register generated handlers
	apigen.RegisterHandlersWithOptions(r, apiServer, apigen.GinServerOptions{
		BaseURL: "",
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Info("Starting HTTP server", "port", port, "address", ":"+port)
	if err := r.Run(":" + port); err != nil {
		log.Error("Failed to start HTTP server", "error", map[string]any{
			"type":  "ServerStartError",
			"stack": err.Error(),
		})
		os.Exit(1)
	}
}
