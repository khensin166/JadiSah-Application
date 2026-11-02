package logger

import (
	"log/slog"
	"os"
	"strings"
	"time"
)

type Config struct {
	Service     string
	Environment string
	Level       slog.Level
}

var globalLogger *slog.Logger

// Init initializes the global JSON structured logger.
func Init(cfg ...Config) *slog.Logger {
	var c Config
	if len(cfg) > 0 {
		c = cfg[0]
	}

	if c.Service == "" {
		c.Service = os.Getenv("SERVICE_NAME")
		if c.Service == "" {
			c.Service = "jadisah-backend"
		}
	}

	if c.Environment == "" {
		c.Environment = os.Getenv("APP_ENV")
		if c.Environment == "" {
			c.Environment = os.Getenv("GIN_MODE")
			if c.Environment == "" {
				c.Environment = "development"
			}
		}
	}

	var lvl slog.Level
	switch strings.ToLower(os.Getenv("LOG_LEVEL")) {
	case "debug":
		lvl = slog.LevelDebug
	case "warn", "warning":
		lvl = slog.LevelWarn
	case "error":
		lvl = slog.LevelError
	default:
		lvl = slog.LevelInfo
	}

	opts := &slog.HandlerOptions{
		Level: lvl,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			// Format timestamp with ISO8601 UTC RFC3339Nano
			if a.Key == slog.TimeKey {
				return slog.Attr{
					Key:   "timestamp",
					Value: slog.StringValue(a.Value.Time().UTC().Format(time.RFC3339Nano)),
				}
			}
			if a.Key == slog.MessageKey {
				return slog.Attr{
					Key:   "message",
					Value: a.Value,
				}
			}
			return a
		},
	}

	handler := slog.NewJSONHandler(os.Stdout, opts)
	globalLogger = slog.New(handler).With(
		slog.String("service", c.Service),
		slog.String("environment", c.Environment),
	)

	slog.SetDefault(globalLogger)
	return globalLogger
}

// Default returns the active global logger, initializing it if necessary.
func Default() *slog.Logger {
	if globalLogger == nil {
		return Init()
	}
	return globalLogger
}

func Info(msg string, args ...any) {
	Default().Info(msg, args...)
}

func Error(msg string, args ...any) {
	Default().Error(msg, args...)
}

func Warn(msg string, args ...any) {
	Default().Warn(msg, args...)
}

func Debug(msg string, args ...any) {
	Default().Debug(msg, args...)
}

func With(args ...any) *slog.Logger {
	return Default().With(args...)
}

