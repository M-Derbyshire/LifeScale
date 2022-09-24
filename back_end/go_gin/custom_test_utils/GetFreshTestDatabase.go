package customtestutils

import (
	"fmt"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func GetFreshTestDatabase() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("../testing.db"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("error while connecting to database: %s", err.Error())
	}

	db.Exec("DROP TABLE IF EXISTS users;")
	db.Exec("DROP TABLE IF EXISTS scales;")
	db.Exec("DROP TABLE IF EXISTS categories;")
	db.Exec("DROP TABLE IF EXISTS actions;")
	db.Exec("DROP TABLE IF EXISTS timespans;")

	migrateErr := db.AutoMigrate(&models.User{}, &models.Scale{}, &models.Category{}, &models.Action{}, &models.Timespan{})
	if migrateErr != nil {
		return nil, fmt.Errorf("error while migrating database: %s", err.Error())
	}

	return db, nil
}
