package routing

import (
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/handlers"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(r *gin.Engine, db *gorm.DB, pathPrefix string, jwtKey string, jwtExpirationMins int) {

	userService := services.UserService{DB: db}
	scaleService := services.ScaleService{DB: db}

	userHandlers := handlers.UserHandlerProvider{DB: db, Service: userService}
	authHandlers := handlers.AuthHandlerProvider{DB: db, Service: userService, JwtKey: jwtKey, JwtExpirationMinutes: jwtExpirationMins}
	scaleHandlers := handlers.ScaleHandlerProvider{DB: db, Service: scaleService}

	r.POST(pathPrefix+"/user", userHandlers.RegistrationHandler)
	r.POST(pathPrefix+"/login", authHandlers.SignInHandler)

	authGroup := r.Group(pathPrefix)
	authGroup.Use(authHandlers.CreateAuthMiddleware())
	{
		authGroup.GET("/tokenrefresh", authHandlers.RefreshTokenHandler)
		authGroup.POST("/user/changepassword", authHandlers.ChangePassword)
		authGroup.PUT("/user", userHandlers.UpdateHandler)

		authGroup.GET("/scale/:id", scaleHandlers.RetrievalHandler)
		authGroup.POST("/scale", scaleHandlers.CreateHandler)
	}

}
