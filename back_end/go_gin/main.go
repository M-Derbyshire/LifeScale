package main

import (
	"log"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/env"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/routing"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {

	envVars, envErr := env.LoadEnvVars("./.env")
	if envErr != nil {
		log.Fatal(envErr)
	}

	router := gin.Default()

	db, dbErr := gorm.Open(mysql.Open(envVars.DatabaseString), &gorm.Config{})
	if dbErr != nil {
		log.Fatal(dbErr)
	}

	routing.Setup(router, db, envVars)

	hostAddress := envVars.Host + ":" + envVars.Port

	if envVars.TlsCertPath == "" || envVars.TlsKeyPath == "" {
		router.Run(hostAddress) // Run unsecure
	} else {
		router.RunTLS(hostAddress, envVars.TlsCertPath, envVars.TlsKeyPath) // Run with SSL
	}
}
