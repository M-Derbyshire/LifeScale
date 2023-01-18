package handlers

import (
	"errors"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/gin-gonic/gin"
)

// Extracts the authenticated user from the given gin context, casts it, then returns it
func GetAuthUserFromContext(c *gin.Context) (models.User, error) {
	authUserVal, authIsOk := c.Get("auth-user")
	if !authIsOk {
		return models.User{}, errors.New("unable to process the user in the authentication token")
	}

	authUser, castOk := authUserVal.(models.User)
	if !castOk || authUser.ResolveID() != nil {
		return models.User{}, errors.New("error while processing the authenticated user")
	}

	idResolveErr := authUser.ResolveID()
	if idResolveErr != nil {
		return models.User{}, idResolveErr
	}

	return authUser, nil
}
