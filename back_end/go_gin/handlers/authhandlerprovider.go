package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Provides methods that are handlers and middleware for the auth routes
type AuthHandlerProvider struct {
	DB                   *gorm.DB
	Service              services.UserService
	JwtKey               string
	JwtExpirationMinutes int //How many minutes until a JWT expires?
}

//The claims to go into a JWT
type JwtClaims struct {
	jwt.StandardClaims
	ID string `json:"id"`
}

type JwtOutput struct {
	Token   string      `json:"token"`
	Expires time.Time   `json:"expires"`
	User    models.User `json:"user"`
}

func getTokenExpirationTime(minutes int) time.Time {
	return time.Now().Add(time.Duration(minutes) * time.Minute)
}

func getTokenStringFromHeader(header string) (string, error) {
	authHeaderPrefix := "Bearer "

	// If no prefix, or just the prefix
	if !strings.HasPrefix(header, authHeaderPrefix) || len(header) == len(authHeaderPrefix) {
		return "", errors.New("incorrectly shaped Authorization header")
	}

	return header[len(authHeaderPrefix):], nil
}

// Signin ------------------------------------------------
func (ahp *AuthHandlerProvider) SignInHandler(c *gin.Context) {

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	dbUser, dbErr := ahp.Service.Get(0, user.Email, true)
	if dbErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "incorrect password provided",
		})
		return
	}

	dbUser.Password = "" //We don't want to return the user password

	expirationDateTime := getTokenExpirationTime(ahp.JwtExpirationMinutes)
	claims := &JwtClaims{
		ID: dbUser.StrID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationDateTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, tokenErr := token.SignedString([]byte(ahp.JwtKey))
	if tokenErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while generating authentication token", //Not returning error, incase it contains the JwtKey
		})
		return
	}

	c.JSON(http.StatusOK, JwtOutput{
		Token:   tokenStr,
		Expires: expirationDateTime,
		User:    dbUser,
	})
}

// Password Change ------------------------------------
func (ahp *AuthHandlerProvider) ChangePassword(c *gin.Context) {

	var passChangeData models.PasswordChange
	if err := c.ShouldBindJSON(&passChangeData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	authUserVal, authUserOk := c.Get("auth-user")
	if !authUserOk {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user is not authorised",
		})
		return
	}

	//Cast authUser to a User struct
	authUser, castOk := authUserVal.(models.User)
	if !castOk {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while processing the authenticated user",
		})
		return
	}

	// Check the current password matches
	if err := bcrypt.CompareHashAndPassword([]byte(authUser.Password), []byte(passChangeData.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "provided current password is incorrect",
		})
		return
	}

	//Now change the password
	authUser.Password = passChangeData.NewPassword //Will get hashed by service
	resultUser, updateErr := ahp.Service.Update(authUser, true)
	if updateErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while applying password update to database",
		})
		return
	}

	resultUser.Password = ""
	c.JSON(http.StatusOK, resultUser)
}

// Refresh token --------------------------------------
func (ahp *AuthHandlerProvider) RefreshTokenHandler(c *gin.Context) {

	// First get the token and JWT claims

	tokenValue, headerErr := getTokenStringFromHeader(c.GetHeader("Authorization"))
	if headerErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": headerErr.Error(),
		})
	}

	claims := &JwtClaims{}
	token, tokenErr := jwt.ParseWithClaims(tokenValue, claims, func(tkn *jwt.Token) (interface{}, error) {
		return []byte(ahp.JwtKey), nil
	})
	if tokenErr != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": tokenErr.Error(),
		})
		return
	}
	if token == nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid token provided",
		})
		return
	}

	// Second, setup new expiration time (if it's required)

	//If greater than 30 seconds left before expiration
	expireWindow := int64(30)
	if time.Until(time.Unix(claims.ExpiresAt, 0)) > time.Duration(expireWindow*int64(time.Second)) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("JWT token will not expire in the next %d seconds", expireWindow),
		})
		return
	}

	// Finally, construct new token

	newExpirationDateTime := getTokenExpirationTime(ahp.JwtExpirationMinutes)
	claims.ExpiresAt = newExpirationDateTime.Unix()

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	newTokenStr, newTokenErr := newToken.SignedString([]byte(ahp.JwtKey))
	if newTokenErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "unable to generate new JWT token",
		})
		return
	}

	c.JSON(http.StatusOK, JwtOutput{
		Expires: newExpirationDateTime,
		Token:   newTokenStr,
	})
}

//Auth Middleware -------------------------------------------------------
func (ahp *AuthHandlerProvider) CreateAuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {
		headerStr := c.GetHeader("Authorization")
		if headerStr == "" {
			c.AbortWithStatus(401)
		}

		tokenStr, headerErr := getTokenStringFromHeader(headerStr)
		if headerErr != nil {
			c.AbortWithError(http.StatusUnauthorized, headerErr)
		}

		claims := &JwtClaims{}
		token, tokenErr := jwt.ParseWithClaims(tokenStr, claims, func(tkn *jwt.Token) (interface{}, error) {
			return []byte(ahp.JwtKey), nil
		})

		if tokenErr != nil || token == nil || !token.Valid {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		numId, numErr := strconv.ParseInt(claims.ID, 0, 64)
		if numErr != nil {
			c.AbortWithError(http.StatusInternalServerError, errors.New("unable to parse the given authorised user ID"))
		}

		user, userErr := ahp.Service.Get(uint64(numId), "", false)
		if userErr != nil {
			c.AbortWithError(http.StatusUnauthorized, errors.New("unable to find the user in the token"))
		}

		c.Set("auth-user", user)

		c.Next()
	}

}
