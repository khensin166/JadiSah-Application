# ROUTING.md

## Standar Pembuatan Routing (Gin)

Semua endpoint untuk Frontend harus dibuat di bawah grup `/api`.

**Contoh yang Benar:**
```go
api := r.Group("/api")
{
    // Akses: GET /api/users
    api.GET("/users", controllers.GetUsers)
    
    // Gunakan middleware (contoh: Auth)
    protected := api.Group("/")
    protected.Use(middlewares.RequireAuth)
    {
        protected.POST("/transactions", controllers.CreateTransaction)
    }
}
```

Jangan membuat *route* di luar grup `/api` kecuali untuk *Health Check* Infrastruktur K3s.
