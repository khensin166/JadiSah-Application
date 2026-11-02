package logger

import (
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// Recovery returns a gin.HandlerFunc that catches any panics, logs them as structured JSON,
// and returns a standardized 500 JSON response containing the trace_id.
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				traceID, _ := c.Get(TraceIDKey)
				if traceID == nil || traceID == "" {
					traceID = c.GetHeader(TraceIDHeader)
				}

				stack := string(debug.Stack())
				errMessage := fmt.Sprintf("%v", r)

				errMap := map[string]any{
					"type":  "PanicError",
					"stack": stack,
				}

				var userIDVal any = nil
				if uid, exists := c.Get(UserIDKey); exists && uid != "" {
					userIDVal = uid
				}

				Default().LogAttrs(
					c.Request.Context(),
					slog.LevelError,
					fmt.Sprintf("Panic recovered: %s", errMessage),
					slog.String("trace_id", fmt.Sprint(traceID)),
					slog.Any("user_id", userIDVal),
					slog.String("method", c.Request.Method),
					slog.String("path", c.Request.URL.Path),
					slog.Int("status_code", http.StatusInternalServerError),
					slog.String("client_ip", c.ClientIP()),
					slog.Any("error", errMap),
				)

				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"message":  "Terjadi kesalahan internal pada server",
					"trace_id": traceID,
				})
			}
		}()

		c.Next()
	}
}

