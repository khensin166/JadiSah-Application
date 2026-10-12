// Package api berisi kontrak OpenAPI (openapi.yaml) yang menjadi Single Source of Truth.
//
// Jalankan `go generate ./...` dari folder backend/ setiap kali openapi.yaml berubah.
package api

import _ "embed"

//go:generate go tool oapi-codegen -config oapi-codegen.yaml openapi.yaml

// Spec adalah isi mentah openapi.yaml, disajikan di /api/openapi.yaml untuk Swagger UI.
//
//go:embed openapi.yaml
var Spec []byte
