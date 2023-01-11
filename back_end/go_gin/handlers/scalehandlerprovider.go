package handlers

import (
	"net/http"
	"strings"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

//Provides methods handlers for the user-related routes
type ScaleHandlerProvider struct {
	DB      *gorm.DB
	Service services.ScaleService
}

//Handler for scale GET requests
func (shp *ScaleHandlerProvider) RetrievalHandler(c *gin.Context) {

	// Extract ID from query
	idStr := c.Param("id")

	// Should the timespans be limited to the display day count only?
	tsDayCountOnlyStr := c.DefaultQuery("daycounttimespansonly", "false")
	tsDayCountOnly := (tsDayCountOnlyStr != "false")

	//Get the auth user from the auth middleware
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

	//Get the scale, and validate all is correct
	scale, scaleErr := shp.Service.Get(idStr, tsDayCountOnly)
	if scaleErr != nil {
		errStr := scaleErr.Error()

		if strings.HasSuffix(errStr, "record not found") {
			c.JSON(http.StatusNotFound, gin.H{
				"error": scaleErr.Error(),
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": scaleErr.Error(),
			})
		}

		return
	}

	authErr := scale.ValidateAuthorisation(authUser, *shp.DB)
	if authErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": authErr.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, scale)
}

// Handler for scale POST requests
func (shp *ScaleHandlerProvider) CreateHandler(c *gin.Context) {

	//Get the auth user from the auth middleware
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

	// Get the new scale from the request
	var newScale models.Scale
	if err := c.ShouldBindJSON(&newScale); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error while processing the provided scale: " + err.Error(),
		})
	}

	// Security related operations
	newScale.UserID = authUser.ID

	if err := newScale.Validate(authUser, *shp.DB, true); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "the provided scale is not valid: " + err.Error(),
		})
	}

	newScale.Sanitise()

	//Now we can create the scale
	resultScale, createErr := shp.Service.Create(newScale)
	if createErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": createErr.Error(),
		})
	}

	c.JSON(http.StatusCreated, resultScale)
}
