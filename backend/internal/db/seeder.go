package db

import (
	"log"

	"github.com/khensin166/JadiSah-Application/backend/internal/models"
	"gorm.io/gorm"
)

// SeedRolesAndPermissions populates the database with default RBAC entries.
func SeedRolesAndPermissions(db *gorm.DB) error {
	log.Println("Seeding roles and permissions...")

	// 1. Definisikan Permissions
	permissions := []models.Permission{
		// Profile & Couples (Umum)
		{Action: "profile:read", Description: "Read own profile"},
		{Action: "profile:update", Description: "Update own profile"},
		{Action: "couple:read", Description: "View couple link status"},
		{Action: "couple:invite", Description: "Send, accept, or reject couple invitations"},

		// Admin (Dashboard/Management)
		{Action: "users:read", Description: "View all users"},
		{Action: "roles:read", Description: "View all roles"},

		// Super Admin (Billing & Critical Auth)
		{Action: "roles:assign", Description: "Assign roles to users"},
		{Action: "subscriptions:update", Description: "Upgrade/downgrade user subscription"},
	}

	// Upsert (Insert or Ignore) Permissions
	for _, p := range permissions {
		err := db.Where("action = ?", p.Action).FirstOrCreate(&p).Error
		if err != nil {
			return err
		}
	}

	// 2. Definisikan Roles
	roles := []models.Role{
		{Name: "SUPER_ADMIN", Description: "Master of the universe"},
		{Name: "ADMIN", Description: "System administrator"},
		{Name: "USER", Description: "Regular customer/couple"},
	}

	// Upsert Roles
	for i, r := range roles {
		err := db.Where("name = ?", r.Name).FirstOrCreate(&roles[i]).Error
		if err != nil {
			return err
		}
	}

	// 3. Tautkan Role dengan Permission-nya
	// Ambil ID terbaru dari database untuk di-_assign_
	var allPermissions []models.Permission
	db.Find(&allPermissions)

	permMap := make(map[string]models.Permission)
	for _, p := range allPermissions {
		permMap[p.Action] = p
	}

	// Mapping kebutuhan
	rolePermsMap := map[string][]string{
		"USER":        {"profile:read", "profile:update", "couple:read", "couple:invite"},
		"ADMIN":       {"profile:read", "profile:update", "couple:read", "couple:invite", "users:read", "roles:read"},
		"SUPER_ADMIN": {"profile:read", "profile:update", "couple:read", "couple:invite", "users:read", "roles:read", "roles:assign", "subscriptions:update"},
	}

	for _, role := range roles {
		var roleToUpdate models.Role
		db.Where("name = ?", role.Name).First(&roleToUpdate)

		var permsToAssign []models.Permission
		for _, action := range rolePermsMap[role.Name] {
			permsToAssign = append(permsToAssign, permMap[action])
		}

		// GORM: Replace association (menghapus yang tidak ada di list baru, menambah yang belum ada)
		if err := db.Model(&roleToUpdate).Association("Permissions").Replace(permsToAssign); err != nil {
			return err
		}
	}

	log.Println("Seeding completed!")
	return nil
}
