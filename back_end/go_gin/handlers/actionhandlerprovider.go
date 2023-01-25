package handlers

import (
	"net/http"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//Provides methods handlers for the action-related routes
type ActionHandlerProvider struct {
	DB              *gorm.DB
	Service         services.ActionService
	CategoryService services.CategoryService
}

// Handler for action POST requests
func (ahp *ActionHandlerProvider) CreateHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
	authUser, authUserErr := GetAuthUserFromContext(c)
	if authUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Get the new action from the request
	var newAction models.Action
	if err := c.ShouldBindJSON(&newAction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while processing the provided action: " + err.Error(),
		})
	}

	// Security related operations
	categoryIdStr := c.Param("categoryid")
	parentCategory, categoryErr := ahp.CategoryService.Get(categoryIdStr)
	if categoryErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while retrieving category: " + categoryErr.Error(),
		})
		return
	}

	categoryAuthErr := parentCategory.ValidateAuthorisation(authUser, *ahp.DB)
	if categoryAuthErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": categoryAuthErr.Error(),
		})
		return
	}

	newAction.CategoryID = parentCategory.ID

	if err := newAction.Validate(authUser, *ahp.DB, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "the provided action is not valid: " + err.Error(),
		})
		return
	}

	newAction.Sanitise()

	//Now we can create the action
	resultAction, createErr := ahp.Service.Create(newAction)
	if createErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": createErr.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, resultAction)
}

// Handler for PUT requests (not suitable for PATCH, as will revert missing properties to zero value)
func (ahp *ActionHandlerProvider) UpdateHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
	authUser, authUserErr := GetAuthUserFromContext(c)
	if authUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Extract ID from query
	idStr := c.Param("id")

	//Get the current category record
	action, readErr := ahp.Service.Get(idStr)
	if readErr != nil {
		status, hMap := interpretRetrievalError(readErr)
		c.JSON(status, hMap)
		return
	}

	// Confirm auth
	authErr := action.ValidateAuthorisation(authUser, *ahp.DB)
	if authErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": authErr.Error(),
		})

		return
	}

	// Get the new action data from the request
	var newActionData models.Action
	if err := c.ShouldBindJSON(&newActionData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while processing the provided action: " + err.Error(),
		})

		return
	}

	// Correct any bad strings
	newActionData.Sanitise()

	// Make the changes
	action.Name = newActionData.Name
	action.Weight = newActionData.Weight

	result, updateErr := ahp.Service.Update(action)
	if updateErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": updateErr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}

// Handler for DELETE requests
func (ahp *ActionHandlerProvider) DeleteHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
	authUser, authUserErr := GetAuthUserFromContext(c)
	if authUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Extract ID from query
	idStr := c.Param("id")

	//Get the current action record
	action, readErr := ahp.Service.Get(idStr)
	if readErr != nil {
		status, hMap := interpretRetrievalError(readErr)
		c.JSON(status, hMap)
		return
	}

	// Confirm auth
	authErr := action.ValidateAuthorisation(authUser, *ahp.DB)
	if authErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": authErr.Error(),
		})

		return
	}

	//Run the delete
	deleteErr := ahp.Service.Delete(action.ID)
	if deleteErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": deleteErr.Error(),
		})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}
