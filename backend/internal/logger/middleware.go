package logger

import (
	"log/slog"
	"math"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const (
	TraceIDHeader = "X-Request-ID"
	TraceIDKey    = "trace_id"
	UserIDKey     = "user_id"
)

// Middleware returns a gin.HandlerFunc that logs requests in structured JSON.
func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// 1. Trace ID extraction or generation
		traceID := c.GetHeader(TraceIDHeader)
		if traceID == "" {
			traceID = uuid.New().String()
		}
		c.Set(TraceIDKey, traceID)
		c.Header(TraceIDHeader, traceID)

		// 2. Process Request
		c.Next()

		// 3. Compute Latency in Milliseconds (rounded to 2 decimal places)
		latency := time.Since(start)
		latencyMs := math.Round(float64(latency.Microseconds())/10.0) / 100.0

		// 4. Extract User ID if set by auth handlers
		var userIDVal any = nil
		if uid, exists := c.Get(UserIDKey); exists && uid != "" {
			userIDVal = uid
		}

		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery
		if rawQuery != "" {
			path = path + "?" + rawQuery
		}

		clientIP := c.ClientIP()

		// 5. Build log attributes
		attrs := []slog.Attr{
			slog.String("trace_id", traceID),
			slog.Any("user_id", userIDVal),
			slog.String("method", method),
			slog.String("path", path),
			slog.Int("status_code", status),
			slog.String("client_ip", clientIP),
			slog.Float64("latency_ms", latencyMs),
		}

		// 6. Handle Errors (if any registered in gin.Context)
		if len(c.Errors) > 0 {
			errMap := map[string]any{
				"type":  "HandlerError",
				"stack": c.Errors.String(),
			}
			attrs = append(attrs, slog.Any("error", errMap))
		}

		// 7. Determine log level and message
		logMsg := "HTTP request completed"
		lvl := slog.LevelInfo
		if status >= 500 {
			lvl = slog.LevelError
			logMsg = "HTTP server error"
		} else if status >= 400 {
			lvl = slog.LevelWarn
			logMsg = "HTTP client warning"
		}

		Default().LogAttrs(c.Request.Context(), lvl, logMsg, attrs...)
	}
}

