package handlers

import (
	"net/http"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//Provides methods handlers for the category-related routes
type CategoryHandlerProvider struct {
	DB           *gorm.DB
	Service      services.CategoryService
	ScaleService services.ScaleService
}

// Handler for category POST requests
func (chp *CategoryHandlerProvider) CreateHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
	authUser, authUserErr := GetAuthUserFromContext(c)
	if authUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Get the new category from the request
	var newCategory models.Category
	if err := c.ShouldBindJSON(&newCategory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while processing the provided category: " + err.Error(),
		})
	}

	// Security related operations
	scaleIdStr := c.Param("scaleid")
	parentScale, scaleErr := chp.ScaleService.Get(scaleIdStr, services.NoTimespans)
	if scaleErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while retrieving scale: " + scaleErr.Error(),
		})
		return
	}

	scaleAuthErr := parentScale.ValidateAuthorisation(authUser, *chp.DB)
	if scaleAuthErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": scaleAuthErr.Error(),
		})
		return
	}

	newCategory.ScaleID = parentScale.ID

	if err := newCategory.Validate(authUser, *chp.DB, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "the provided category is not valid: " + err.Error(),
		})
		return
	}

	newCategory.Sanitise()

	//Now we can create the category
	resultCategory, createErr := chp.Service.Create(newCategory)
	if createErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": createErr.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, resultCategory)
}

// Handler for PUT requests (not suitable for PATCH, as will revert missing properties to zero value)
func (chp *CategoryHandlerProvider) UpdateHandler(c *gin.Context) {

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
	category, readErr := chp.Service.Get(idStr)
	if readErr != nil {
		status, hMap := interpretRetrievalError(readErr)
		c.JSON(status, hMap)
		return
	}

	// Confirm auth
	authErr := category.ValidateAuthorisation(authUser, *chp.DB)
	if authErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": authErr.Error(),
		})

		return
	}

	// Get the new scale data from the request
	var newCategoryData models.Category
	if err := c.ShouldBindJSON(&newCategoryData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while processing the provided category: " + err.Error(),
		})

		return
	}

	// Correct any bad strings
	newCategoryData.Sanitise()

	// Make the changes
	category.Name = newCategoryData.Name
	category.Color = newCategoryData.Color
	category.DesiredWeight = newCategoryData.DesiredWeight

	result, updateErr := chp.Service.Update(category)
	if updateErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": updateErr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}

// Handler for DELETE requests
func (chp *CategoryHandlerProvider) DeleteHandler(c *gin.Context) {

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
	category, readErr := chp.Service.Get(idStr)
	if readErr != nil {
		status, hMap := interpretRetrievalError(readErr)
		c.JSON(status, hMap)
		return
	}

	// Confirm auth
	authErr := category.ValidateAuthorisation(authUser, *chp.DB)
	if authErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": authErr.Error(),
		})

		return
	}

	//Run the delete
	deleteErr := chp.Service.Delete(category.ID)
	if deleteErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": deleteErr.Error(),
		})
		return
	}

	c.JSON(http.StatusNoContent, gin.H{})
}
