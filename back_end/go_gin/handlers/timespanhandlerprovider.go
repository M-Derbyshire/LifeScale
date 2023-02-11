package handlers

import (
	"net/http"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//Provides methods handlers for the timespan-related routes
type TimespanHandlerProvider struct {
	DB            *gorm.DB
	Service       services.TimespanService
	ActionService services.ActionService
}

// Handler for action POST requests
func (thp *TimespanHandlerProvider) CreateHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
	authUser, authUserErr := GetAuthUserFromContext(c)
	if authUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Get the new timespan from the request
	var newTimespan models.Timespan
	if err := c.ShouldBindJSON(&newTimespan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while processing the provided timespan: " + err.Error(),
		})
	}

	// Security related operations
	actionIdStr := c.Param("actionid")
	parentAction, actionErr := thp.ActionService.Get(actionIdStr)
	if actionErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while retrieving action: " + actionErr.Error(),
		})
		return
	}

	actionAuthErr := parentAction.ValidateAuthorisation(authUser, *thp.DB)
	if actionAuthErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": actionAuthErr.Error(),
		})
		return
	}

	newTimespan.ActionID = parentAction.ID

	if err := newTimespan.Validate(authUser, *thp.DB, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "the provided timespan is not valid: " + err.Error(),
		})
		return
	}

	newTimespan.Sanitise()

	//Now we can create the action
	resultTimespan, createErr := thp.Service.Create(newTimespan)
	if createErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": createErr.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, resultTimespan)
}

// Handler for DELETE requests
func (thp *TimespanHandlerProvider) DeleteHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
	authUser, authUserErr := GetAuthUserFromContext(c)
	if authUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Extract ID from query
	idStr := c.Param("timespanid")

	//Get the current timespan record
	timespan, readErr := thp.Service.Get(idStr)
	if readErr != nil {
		status, hMap := interpretRetrievalError(readErr)
		c.JSON(status, hMap)
		return
	}

	// Confirm auth
	authErr := timespan.ValidateAuthorisation(authUser, *thp.DB)
	if authErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": authErr.Error(),
		})

		return
	}

	//Run the delete
	deleteErr := thp.Service.Delete(timespan.ID)
	if deleteErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": deleteErr.Error(),
		})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}
