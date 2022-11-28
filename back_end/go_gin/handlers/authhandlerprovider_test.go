package handlers_test

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	customtestutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_test_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/handlers"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandlersSuite struct {
	suite.Suite
	DB      *gorm.DB
	Service services.UserService
	Handler handlers.AuthHandlerProvider
}

func (hs *AuthHandlersSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	hs.DB = db
	hs.Service = services.UserService{DB: db}
	hs.Handler = handlers.AuthHandlerProvider{
		DB:                   db,
		Service:              hs.Service,
		JwtKey:               "secret",
		JwtExpirationMinutes: 10,
	}
}

func TestAuthServiceSuite(t *testing.T) {
	suite.Run(t, new(AuthHandlersSuite))
}

// --- Sign in ----------------------------------

func (ahs *AuthHandlersSuite) TestSignInRespondsWithUnauthorisedIfNoUserFound() {

	t := ahs.T()

	user := models.User{
		Email:    "test@test.com",
		Password: "kjsakjdaksjd",
	}

	r := gin.Default()
	r.POST("/", ahs.Handler.SignInHandler)

	testServer := httptest.NewServer(r)

	//This user doesn't exist
	res, _ := postUser(user, testServer)
	defer res.Body.Close()

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestSignInRespondsWithUnauthorisedIfIncorrectPassword() {

	t := ahs.T()

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
	}

	// Create the user in the DB
	_, createErr := ahs.Service.Create(user)
	require.NoError(t, createErr)

	r := gin.Default()

	r.POST("/", ahs.Handler.SignInHandler)

	testServer := httptest.NewServer(r)

	// Now change the password, and try to login
	user.Password = "differentpassword"
	res, _ := postUser(user, testServer)
	defer res.Body.Close()

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestSignInRespondsWithUserAndJwtTokenContainingUserIdAndExpirationTimeThatMatchesTheHandlersExpirationMinutes() {

	t := ahs.T()

	// The current time plus the current JwtExpirationMinutes setting
	estimateNewTime := time.Now().Add(time.Duration(ahs.Handler.JwtExpirationMinutes * int(time.Minute)))

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
		Scales: []models.Scale{
			{
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories: []models.Category{
					{
						Name:          "category1",
						Color:         "red",
						DesiredWeight: 1,
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	// Create the user in the DB
	createdUser, createErr := ahs.Service.Create(user)
	require.NoError(t, createErr)

	//Create the scale in the DB
	user.Scales[0].UserID = createdUser.ID
	createResult := ahs.DB.Create(&user.Scales[0])
	require.NoError(t, createResult.Error)

	r := gin.Default()

	r.POST("/", ahs.Handler.SignInHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := postUser(user, testServer) // Attempt the sign in
	require.NoError(t, reqErr)

	require.Equal(t, http.StatusOK, res.StatusCode)

	resBody, resBodyErr := getJwtOutputFromBody(res)
	require.NoError(t, resBodyErr)

	// Make sure the given expiration date is correct (giving a leeway of 2 seconds here)
	resExpireTime := resBody.Expires
	minExpireTime := estimateNewTime.Add(-time.Second)
	maxExpireTime := estimateNewTime.Add(time.Second)
	require.True(t, resExpireTime.After(minExpireTime))
	require.True(t, resExpireTime.Before(maxExpireTime))

	// Now parse the token
	claims := &handlers.JwtClaims{}
	token, tokenErr := jwt.ParseWithClaims(resBody.Token, claims, func(tkn *jwt.Token) (interface{}, error) {
		return []byte(ahs.Handler.JwtKey), nil
	})
	require.NoError(t, tokenErr)
	require.NotNil(t, token)
	require.True(t, token.Valid)

	//Check the token claims
	require.Equal(t, resBody.Expires.Unix(), claims.ExpiresAt)
	numClaimId, calimIdErr := strconv.Atoi(claims.ID)
	require.NoError(t, calimIdErr)
	require.Equal(t, createdUser.ID, uint64(numClaimId))

	//Check the user in the response body
	require.Equal(t, createdUser.StrID, resBody.User.StrID)
	require.Equal(t, createdUser.Email, resBody.User.Email)
	require.Equal(t, "", resBody.User.Password)

	//Scales should be there, but not with categories
	require.Equal(t, 1, len(resBody.User.Scales))
	require.Equal(t, 0, len(resBody.User.Scales[0].Categories))
}

// --- Change password ---------------------------
func (ahs *AuthHandlersSuite) TestChangePasswordRespondsWithUnauthorisedIfAuthUserIsNotInContext() {

	t := ahs.T()

	passwordChange := models.PasswordChange{
		CurrentPassword: "currentpassword",
		NewPassword:     "newpassword",
	}

	r := gin.Default()

	//Now make the password change request
	r.POST("/", ahs.Handler.ChangePassword)
	testServer := httptest.NewServer(r)

	res, _ := postPasswordChange(passwordChange, testServer)
	defer res.Body.Close()

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestChangePasswordRespondsWithServerErrorIfAuthUserCouldntBeCastToUser() {
	t := ahs.T()

	passwordChange := models.PasswordChange{
		CurrentPassword: "currentpassword",
		NewPassword:     "newpassword",
	}

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("auth-user", struct{ BadProp string }{BadProp: "djksdjalsjd"}) //Not a valid user
		c.Next()
	})

	r.POST("/", ahs.Handler.ChangePassword)
	testServer := httptest.NewServer(r)

	res, _ := postPasswordChange(passwordChange, testServer)
	defer res.Body.Close()

	require.Equal(t, http.StatusInternalServerError, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestChangePasswordRespondsWithUnauthorisedIfGivenCurrentPasswordIsIncorrect() {

	t := ahs.T()

	passwordChange := models.PasswordChange{
		CurrentPassword: "currentpassword",
		NewPassword:     "newpassword",
	}

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Password: "notthecurrentpassword",
	}

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("auth-user", user)
		c.Next()
	})

	r.POST("/", ahs.Handler.ChangePassword)
	testServer := httptest.NewServer(r)

	res, _ := postPasswordChange(passwordChange, testServer)
	defer res.Body.Close()

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)

}

func (ahs *AuthHandlersSuite) TestChangePasswordRespondsWithServerErrorIfServiceErrorWhileChangingThePassword() {
	t := ahs.T()

	passwordChange := models.PasswordChange{
		CurrentPassword: "currentpassword",
		NewPassword:     "newpassword",
	}

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Password: "currentpassword",
	}

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("auth-user", user)
		c.Next()
	})

	r.POST("/", ahs.Handler.ChangePassword)
	testServer := httptest.NewServer(r)

	res, _ := postPasswordChange(passwordChange, testServer)
	defer res.Body.Close()

	require.NotEqual(t, http.StatusOK, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestChangePasswordChangesPasswordIfCurrentCorrectAndRespondsWithAllUserDataExceptPassword() {

	t := ahs.T()

	passwordChange := models.PasswordChange{
		CurrentPassword: "currentpassword",
		NewPassword:     "newpassword",
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(passwordChange.CurrentPassword), bcrypt.DefaultCost)
	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Password: string(hashedPassword),
	}

	ahs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("auth-user", user)
		c.Next()
	})

	r.POST("/", ahs.Handler.ChangePassword)
	testServer := httptest.NewServer(r)

	res, _ := postPasswordChange(passwordChange, testServer)
	defer res.Body.Close()
	require.Equal(t, http.StatusOK, res.StatusCode)

	resUser, resUserErr := getUserFromBody(res)
	require.NoError(t, resUserErr)
	require.Equal(t, "", resUser.Password)

	dbUser := &models.User{}
	ahs.DB.First(dbUser)

	require.Nil(t, bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(passwordChange.NewPassword)))
}

// --- Refresh Token ----------------------------
func (ahs *AuthHandlersSuite) TestRefreshRespondsWithUnauthorisedIfNoAuthHeader() {

	t := ahs.T()

	r := gin.Default()
	r.POST("/", ahs.Handler.RefreshTokenHandler)
	testServer := httptest.NewServer(r)

	client := &http.Client{}
	reqBody := bytes.NewBuffer([]byte("{}"))
	req, _ := http.NewRequest("POST", fmt.Sprintf("%s/", testServer.URL), reqBody)

	res, _ := client.Do(req)

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestRefreshRespondsWithUnauthorisedIfNoTokenInHeader() {
	t := ahs.T()

	r := gin.Default()
	r.POST("/", ahs.Handler.RefreshTokenHandler)
	testServer := httptest.NewServer(r)

	res, _ := postTokenRefresh("", testServer)

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestRefreshRespondsWithUnauthorisedIfTokenIsMishapen() {
	t := ahs.T()

	r := gin.Default()
	r.POST("/", ahs.Handler.RefreshTokenHandler)
	testServer := httptest.NewServer(r)

	res, _ := postTokenRefresh("jwwjkejklwjelkqwjelkqjelqwjeklqje", testServer)

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestRefreshRespondsWithUnauthorisedIfTokenIsExpired() {
	t := ahs.T()

	r := gin.Default()
	r.POST("/", ahs.Handler.RefreshTokenHandler)
	testServer := httptest.NewServer(r)

	//Create JWT (with expired date)
	claims := &handlers.JwtClaims{}
	claims.ExpiresAt = time.Now().Add(time.Hour * -5).Unix()
	claims.ID = "1"
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, tokenErr := token.SignedString([]byte(ahs.Handler.JwtKey))
	require.NoError(t, tokenErr)

	res, _ := postTokenRefresh(tokenStr, testServer)

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestRefreshRespondsWithBadRequestIfTokenIsNotSetToExpireInThirtySeconds() {
	t := ahs.T()

	r := gin.Default()
	r.POST("/", ahs.Handler.RefreshTokenHandler)
	testServer := httptest.NewServer(r)

	//Create JWT
	claims := &handlers.JwtClaims{}
	claims.ExpiresAt = time.Now().Add(time.Minute * 10).Unix()
	claims.ID = "1"
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, tokenErr := token.SignedString([]byte(ahs.Handler.JwtKey))
	require.NoError(t, tokenErr)

	res, _ := postTokenRefresh(tokenStr, testServer)

	require.Equal(t, http.StatusBadRequest, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestRefreshRespondsWithRefreshedTokenThatHasExpirationTimeUpdatedWithHandlerJwtMinutesValue() {
	t := ahs.T()

	r := gin.Default()
	r.POST("/", ahs.Handler.RefreshTokenHandler)
	testServer := httptest.NewServer(r)

	//Create JWT
	claims := &handlers.JwtClaims{}
	claims.ExpiresAt = time.Now().Add(time.Second * 10).Unix()
	claims.ID = "1"
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, tokenErr := token.SignedString([]byte(ahs.Handler.JwtKey))
	require.NoError(t, tokenErr)

	res, _ := postTokenRefresh(tokenStr, testServer)
	require.Equal(t, http.StatusOK, res.StatusCode)

	//When comparing date/times, we don't want to go down to the millisecond level, so just going to format to this
	timeComparisonFormat := "01/02/2006 15:04:05"

	resBody, _ := getJwtOutputFromBody(res)
	expectedNewExpiration := time.Now().Add(time.Duration(ahs.Handler.JwtExpirationMinutes) * time.Minute)

	require.Equal(t, expectedNewExpiration.Format(timeComparisonFormat), resBody.Expires.Format(timeComparisonFormat))

	//Now confirm the data in the new JWT is correct
	resClaims := &handlers.JwtClaims{}
	jwt.ParseWithClaims(resBody.Token, resClaims, func(tkn *jwt.Token) (interface{}, error) {
		return []byte(ahs.Handler.JwtKey), nil
	})

	require.Equal(t, claims.ID, resClaims.ID)
	require.Equal(t, expectedNewExpiration.Format(timeComparisonFormat), time.Unix(resClaims.ExpiresAt, 0).Format(timeComparisonFormat))
}

// --- Auth Middleware -------------------------
func (ahs *AuthHandlersSuite) TestAuthMiddlewareRespondsWithUnauthorisedIfNoAuthHeader() {

	t := ahs.T()

	r := gin.Default()
	r.Use(ahs.Handler.CreateAuthMiddleware())
	r.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, "") })

	testServer := httptest.NewServer(r)

	ahs.Service.Create(models.User{
		Email:    "test@test.com",
		Password: "password",
	})

	res, _ := getRequestWithAuthHeader("", testServer)
	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestAuthMiddlewareRespondsWithUnauthorisedIfNoTokenInAuthHeader() {

	t := ahs.T()

	r := gin.Default()
	r.Use(ahs.Handler.CreateAuthMiddleware())
	r.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, "") })

	testServer := httptest.NewServer(r)

	ahs.Service.Create(models.User{
		Email:    "test@test.com",
		Password: "password",
	})

	res, _ := getRequestWithAuthHeader("Bearer ", testServer)
	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestAuthMiddlewareRespondsWithUnauthorisedIfTokenIsInvalid() {

	t := ahs.T()

	r := gin.Default()
	r.Use(ahs.Handler.CreateAuthMiddleware())
	r.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, "") })

	testServer := httptest.NewServer(r)

	ahs.Service.Create(models.User{
		Email:    "test@test.com",
		Password: "password",
	})

	res, _ := getRequestWithAuthHeader("Bearer jdaskljdlkasjlaksj", testServer)
	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestAuthMiddlewareRespondsWithUnauthorisedIfUserDoesntExist() {

	t := ahs.T()

	r := gin.Default()
	r.Use(ahs.Handler.CreateAuthMiddleware())
	r.GET("/", func(c *gin.Context) { c.JSON(http.StatusOK, "") })

	testServer := httptest.NewServer(r)

	res, _ := getRequestWithAuthHeader("Bearer jdaskljdlkasjlaksj", testServer)
	require.Equal(t, http.StatusUnauthorized, res.StatusCode)
}

func (ahs *AuthHandlersSuite) TestAuthMiddlewareAddsUserToContext() {

	t := ahs.T()

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
	}
	ahs.Service.Create(user)

	tokenClaims := &handlers.JwtClaims{}
	tokenClaims.ID = "1"
	tokenClaims.ExpiresAt = time.Now().Add(time.Minute * 10).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)
	tokenStr, tokenErr := token.SignedString([]byte(ahs.Handler.JwtKey))
	require.NoError(t, tokenErr)

	r := gin.Default()
	r.Use(ahs.Handler.CreateAuthMiddleware())

	var userFromContext *models.User
	r.GET("/", func(c *gin.Context) {
		authUserVal, authUserOk := c.Get("auth-user")
		require.True(t, authUserOk)

		authUser, castOk := authUserVal.(models.User)
		require.True(t, castOk)

		userFromContext = &authUser
		c.JSON(http.StatusOK, "")
	})

	testServer := httptest.NewServer(r)

	res, _ := getRequestWithAuthHeader("Bearer "+tokenStr, testServer)
	require.Equal(t, http.StatusOK, res.StatusCode)

	require.Equal(t, user.Email, userFromContext.Email)
}
