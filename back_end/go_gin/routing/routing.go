package routing

import (
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/env"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/handlers"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(r *gin.Engine, db *gorm.DB, envVars env.EnvVars) {

	userService := services.UserService{DB: db}
	scaleService := services.ScaleService{DB: db}
	categoryService := services.CategoryService{DB: db}
	actionService := services.ActionService{DB: db}
	timespanService := services.TimespanService{DB: db}

	emailer := custom_utils.MakeEmailer(envVars.EmailFrom, envVars.EmailUsername, envVars.EmailPassword, envVars.EmailHost, envVars.EmailPort)

	authHandlers := handlers.AuthHandlerProvider{
		DB:                   db,
		Service:              userService,
		JwtKey:               envVars.JwtKey,
		JwtExpirationMinutes: envVars.JwtExpirationMins,
		Emailer:              emailer,
	}
	userHandlers := handlers.UserHandlerProvider{DB: db, Service: userService}
	scaleHandlers := handlers.ScaleHandlerProvider{DB: db, Service: scaleService}
	categoryHandlers := handlers.CategoryHandlerProvider{DB: db, Service: categoryService, ScaleService: scaleService}
	actionHandlers := handlers.ActionHandlerProvider{DB: db, Service: actionService, CategoryService: categoryService}
	timespanHandlers := handlers.TimespanHandlerProvider{DB: db, Service: timespanService, ActionService: actionService}

	r.POST(envVars.PathPrefix+"/user", userHandlers.RegistrationHandler)
	r.POST(envVars.PathPrefix+"/login", authHandlers.SignInHandler)
	r.POST(envVars.PathPrefix+"/passwordreset", authHandlers.PasswordResetRequestHandler)

	authGroup := r.Group(envVars.PathPrefix)
	authGroup.Use(authHandlers.CreateAuthMiddleware())
	{
		authGroup.GET("/tokenrefresh", authHandlers.RefreshTokenHandler)
		authGroup.PUT("/user/changepassword", authHandlers.ChangePassword)
		authGroup.PUT("/user", userHandlers.UpdateHandler)

		authGroup.GET("/scale/:scaleid", scaleHandlers.RetrievalHandler)
		authGroup.POST("/scale", scaleHandlers.CreateHandler)
		authGroup.PUT("/scale/:scaleid", scaleHandlers.UpdateHandler)
		authGroup.DELETE("/scale/:scaleid", scaleHandlers.DeleteHandler)

		authGroup.POST("/scale/:scaleid/category", categoryHandlers.CreateHandler)
		authGroup.PUT("/scale/:scaleid/category/:categoryid", categoryHandlers.UpdateHandler)
		authGroup.DELETE("/scale/:scaleid/category/:categoryid", categoryHandlers.DeleteHandler)

		authGroup.POST("/scale/:scaleid/category/:categoryid/action", actionHandlers.CreateHandler)
		authGroup.PUT("/scale/:scaleid/category/:categoryid/action/:actionid", actionHandlers.UpdateHandler)
		authGroup.DELETE("/scale/:scaleid/category/:categoryid/action/:actionid", actionHandlers.DeleteHandler)

		authGroup.POST("/scale/:scaleid/category/:categoryid/action/:actionid/timespan", timespanHandlers.CreateHandler)
		authGroup.DELETE("/scale/:scaleid/category/:categoryid/action/:actionid/timespan/:timespanid", timespanHandlers.DeleteHandler)
	}

}
