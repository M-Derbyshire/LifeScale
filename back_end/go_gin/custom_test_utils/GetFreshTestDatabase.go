package customtestutils

import (
	"fmt"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Get a *gorm.DB, connected to a refreshed database (all data truncated out)
func GetFreshTestDatabase() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("../testing.db"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("error while connecting to database: %s", err.Error())
	}

	var lastExecResult *gorm.DB
	tableNames := []string{"timespans", "actions", "categories", "scales", "users"}

	for _, tableName := range tableNames {
		lastExecResult = db.Exec("DROP TABLE IF EXISTS " + tableName + ";")
		if lastExecResult.Error != nil {
			return nil, fmt.Errorf("error while dropping tables in test database: %s", lastExecResult.Error.Error())
		}
	}

	migrateErr := db.AutoMigrate(&models.User{}, &models.Scale{}, &models.Category{}, &models.Action{}, &models.Timespan{})

	if migrateErr != nil {
		return nil, fmt.Errorf("error while migrating database: %s", err.Error())
	}

	return db, nil
}
