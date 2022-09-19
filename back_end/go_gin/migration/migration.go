package main

import (
	"fmt"
	"log"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/env"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {

	envVars, envErr := env.LoadEnvVars()
	if envErr != nil {
		log.Fatal(envErr)
	}

	fmt.Println("starting to migrate database...")

	db, dbErr := gorm.Open(mysql.Open(envVars.DatabaseString), &gorm.Config{})
	if dbErr != nil {
		log.Fatalf("unable to connect to database: %s", dbErr.Error())
	}

	migrateErr := db.AutoMigrate(&models.User{}, &models.Scale{}, &models.Category{}, &models.Action{}, &models.Timespan{})
	if migrateErr != nil {
		log.Fatalf("unable to complete migration: %s", migrateErr.Error())
	}

	fmt.Println("migration completed successfully")

}
