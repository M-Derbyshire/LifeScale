package handlers_test

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	customtestutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_test_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/handlers"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type UserHandlersSuite struct {
	suite.Suite
	DB      *gorm.DB
	Service services.UserService
	Handler handlers.UserHandlerProvider
}

func (hs *UserHandlersSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	hs.DB = db
	hs.Service = services.UserService{DB: db}
	hs.Handler = handlers.UserHandlerProvider{DB: db, Service: hs.Service}
}

func TestUserServiceSuite(t *testing.T) {
	suite.Run(t, new(UserHandlersSuite))
}

//Create

func (hs *UserHandlersSuite) TestUserRegistrationWillCreateUser() {

	t := hs.T()

	newUser := models.User{
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.POST("/", hs.Handler.RegistrationHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := postUser(newUser, testServer)

	require.NoError(t, reqErr)
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode)

	resBody, resErr := getUserFromBody(res)
	require.NoError(t, resErr)

	require.NotEqual(t, 0, resBody.ID)
	require.Equal(t, newUser.Email, resBody.Email)

	var emailUseCount int64
	hs.DB.Model(&models.User{}).Where("email = ?", newUser.Email).Count(&emailUseCount)
	require.Equal(t, int64(1), emailUseCount)
}

func (hs *UserHandlersSuite) TestUserRegistrationHandlerWillSanitiseUserBeforeSaving() {

	t := hs.T()

	newUser := models.User{
		Email:    "test@test.com",
		Forename: "<h1>test</h1>",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	sanitisedValue := "&lt;h1&gt;test&lt;/h1&gt;"

	r := gin.Default()
	r.POST("/", hs.Handler.RegistrationHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := postUser(newUser, testServer)

	require.NoError(t, reqErr)
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode)

	resBody, resErr := getUserFromBody(res)
	require.NoError(t, resErr)

	//Check the response as well as what's saved
	require.Equal(t, sanitisedValue, resBody.Forename)

	var userCount int64
	hs.DB.Model(&models.User{}).Where("forename = ?", newUser.Forename).Count(&userCount)
	require.Equal(t, int64(0), userCount)

	//Sanitised version
	hs.DB.Model(&models.User{}).Where("forename = ?", sanitisedValue).Count(&userCount)
	require.Equal(t, int64(1), userCount)
}

func (hs *UserHandlersSuite) TestUserRegistrationHandlerWillRespondWithUserValidateError() {

	t := hs.T()

	newUser := models.User{
		Email:    "test@test", //email address invalid
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.POST("/", hs.Handler.RegistrationHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := postUser(newUser, testServer)

	require.NoError(t, reqErr)
	defer res.Body.Close()

	require.Equal(t, http.StatusBadRequest, res.StatusCode)

	errMessage, resErr := getErrorMessageFromBody(res)
	require.NoError(t, resErr)

	require.Contains(t, errMessage, "email")

	//Make sure not saved
	var userCount int64
	hs.DB.Model(&models.User{}).Where("email = ?", newUser.Email).Count(&userCount)
	require.Equal(t, int64(0), userCount)
}
