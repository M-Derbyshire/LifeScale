package handlers

import (
	"fmt"
	"net/http"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//Provides methods handlers for the user-related routes
type UserHandlerProvider struct {
	DB      *gorm.DB
	Service services.UserService
}

//Handler for user registration
func (uhp *UserHandlerProvider) RegistrationHandler(c *gin.Context) {

	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("unable to process the given user: %s", err.Error()),
		})
		return
	}

	if err := user.Validate(models.User{}, *uhp.DB, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("given user is invalid: %s", err.Error()),
		})
		return
	}

	user.Sanitise()

	resultUser, createErr := uhp.Service.Create(user)
	if createErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("unable to register user: %s", createErr.Error()),
		})
		return
	}

	c.JSON(http.StatusOK, resultUser)

}

func (uhp *UserHandlerProvider) UpdateHandler(c *gin.Context) {

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("unable to process the given user: %s", err.Error()),
		})
		return
	}

	authUserVal, authIsOk := c.Get("auth-user")
	if !authIsOk {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "unable to process the user in the authentication token",
		})
		return
	}

	authUser, castOk := authUserVal.(models.User)
	if !castOk || authUser.ResolveID() != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	//Validate the user
	if err := user.ResolveID(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := user.Validate(authUser, *uhp.DB, false); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := user.ValidateAuthorisation(authUser, *uhp.DB); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	//Now update the user
	user.Sanitise()

	updatedUser, updateErr := uhp.Service.Update(user, false)
	if updateErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": updateErr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, updatedUser)
}
