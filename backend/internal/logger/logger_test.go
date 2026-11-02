package logger

import (
	"bytes"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestStructuredLoggerJSONOutput(t *testing.T) {
	var buf bytes.Buffer

	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}
	handler := slog.NewJSONHandler(&buf, opts)
	l := slog.New(handler).With(
		slog.String("service", "test-service"),
		slog.String("environment", "testing"),
	)

	l.Info("Sample log message", "trace_id", "test-trace-123", "user_id", "user-456")

	var logged map[string]any
	if err := json.Unmarshal(buf.Bytes(), &logged); err != nil {
		t.Fatalf("Failed to parse log JSON: %v. Output was: %s", err, buf.String())
	}

	if logged["service"] != "test-service" {
		t.Errorf("Expected service 'test-service', got %v", logged["service"])
	}
	if logged["environment"] != "testing" {
		t.Errorf("Expected environment 'testing', got %v", logged["environment"])
	}
	if logged["msg"] != "Sample log message" {
		t.Errorf("Expected msg 'Sample log message', got %v", logged["msg"])
	}
	if logged["trace_id"] != "test-trace-123" {
		t.Errorf("Expected trace_id 'test-trace-123', got %v", logged["trace_id"])
	}
	if logged["user_id"] != "user-456" {
		t.Errorf("Expected user_id 'user-456', got %v", logged["user_id"])
	}
}

func TestLoggerMiddleware(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Capture stdout output from global logger
	Init(Config{
		Service:     "jadisah-test",
		Environment: "test",
		Level:       slog.LevelInfo,
	})

	r := gin.New()
	r.Use(Middleware())
	r.GET("/test-ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	req := httptest.NewRequest(http.MethodGet, "/test-ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	// Verify X-Request-ID response header
	traceID := w.Header().Get(TraceIDHeader)
	if traceID == "" {
		t.Errorf("Expected %s header in response, but it was empty", TraceIDHeader)
	}
}

func TestLoggerRecovery(t *testing.T) {
	gin.SetMode(gin.TestMode)

	r := gin.New()
	r.Use(Recovery())
	r.GET("/panic-route", func(c *gin.Context) {
		panic("simulated critical crash")
	})

	req := httptest.NewRequest(http.MethodGet, "/panic-route", nil)
	req.Header.Set(TraceIDHeader, "trace-panic-abc")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500 on panic, got %d", w.Code)
	}

	var res map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("Failed to decode response JSON: %v", err)
	}

	if res["trace_id"] != "trace-panic-abc" {
		t.Errorf("Expected trace_id 'trace-panic-abc', got %v", res["trace_id"])
	}
	if res["message"] != "Terjadi kesalahan internal pada server" {
		t.Errorf("Unexpected message: %v", res["message"])
	}
}

func suppressStderr() (*os.File, *os.File) {
	orig := os.Stderr
	r, w, _ := os.Pipe()
	os.Stderr = w
	return orig, r
}

func restoreStderr(orig *os.File, r *os.File) {
	os.Stderr = orig
	_ = r.Close()
}

func TestMain(m *testing.M) {
	gin.DefaultWriter = io.Discard
	gin.DefaultErrorWriter = io.Discard
	os.Exit(m.Run())
}

