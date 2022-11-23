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

// -- Create -------------------------------------------------

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

	require.Equal(t, http.StatusCreated, res.StatusCode)

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

	require.Equal(t, http.StatusCreated, res.StatusCode)

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

// -- Update -----------------------------------------------------------

func (hs *UserHandlersSuite) TestUserUpdateWillRespondWithUserAuthValidationError() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	hs.Service.Create(user)

	userUpdates := models.User{
		StrID:    "2", //Different ID
		Email:    "test2@test.com",
		Forename: "test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(userUpdates, testServer)
	require.NoError(t, reqErr)

	require.Equal(t, http.StatusUnauthorized, res.StatusCode)

	//Make sure not saved
	var userCount int64
	hs.DB.Model(&models.User{}).Where("email = ?", userUpdates.Email).Count(&userCount)
	require.Equal(t, int64(0), userCount)

}

func (hs *UserHandlersSuite) TestUserUpdateWillRespondWithUserValidateError() {
	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)

	userUpdates := models.User{
		StrID:    createdUser.StrID,
		Email:    "test2@test", //invalid email
		Forename: "test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(userUpdates, testServer)
	require.NoError(t, reqErr)

	require.Equal(t, http.StatusBadRequest, res.StatusCode)

	//Make sure not saved
	var userCount int64
	hs.DB.Model(&models.User{}).Where("email = ?", userUpdates.Email).Count(&userCount)
	require.Equal(t, int64(0), userCount)
}

func (hs *UserHandlersSuite) TestUserUpdateWillRespondWithErrorIfNoId() {
	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)

	userUpdates := models.User{ //No id
		Email:    "test2@test.com",
		Forename: "test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(userUpdates, testServer)
	require.NoError(t, reqErr)

	require.Equal(t, http.StatusBadRequest, res.StatusCode)

	//Make sure not saved
	var userCount int64
	hs.DB.Model(&models.User{}).Where("email = ?", userUpdates.Email).Count(&userCount)
	require.Equal(t, int64(0), userCount)

}

func (hs *UserHandlersSuite) TestUserUpdateWillUpdateUserWithChangesAndReturnUserWithoutPasswordOrScales() {

	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)

	userUpdates := models.User{
		StrID:    createdUser.StrID,
		Email:    "test2@test.com",
		Forename: "test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(userUpdates, testServer)
	require.NoError(t, reqErr)
	defer res.Body.Close()
	require.Equal(t, http.StatusOK, res.StatusCode)

	resUser, resBodyErr := getUserFromBody(res)
	require.NoError(t, resBodyErr)

	require.Equal(t, userUpdates.Email, resUser.Email)
	require.Equal(t, userUpdates.Forename, resUser.Forename)
	require.Equal(t, userUpdates.Surname, resUser.Surname)

	require.Equal(t, "", resUser.Password)
	require.Equal(t, 0, len(resUser.Scales))

	//Make sure saved changes
	resUser.ResolveID()
	savedUser, _ := hs.Service.Get(resUser.ID, "", false)
	require.Equal(t, userUpdates.Email, savedUser.Email)
	require.Equal(t, userUpdates.Forename, savedUser.Forename)
	require.Equal(t, userUpdates.Surname, savedUser.Surname)
}

func (hs *UserHandlersSuite) TestUserUpdateWillCallSanitiseOnUserUpdates() {

	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)

	userUpdates := models.User{
		StrID:    createdUser.StrID,
		Email:    "test2@test.com",
		Forename: "<h1>test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	sanitisedName := "&lt;h1&gt;test2"

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(userUpdates, testServer)
	require.NoError(t, reqErr)
	defer res.Body.Close()
	require.Equal(t, http.StatusOK, res.StatusCode)

	resUser, resBodyErr := getUserFromBody(res)
	require.NoError(t, resBodyErr)

	require.Equal(t, sanitisedName, resUser.Forename)

	resUser.ResolveID()
	savedUser, _ := hs.Service.Get(resUser.ID, "", false)
	require.Equal(t, sanitisedName, savedUser.Forename)
}

func (hs *UserHandlersSuite) TestUserUpdateWillNotChangePassword() {

	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)
	var createdUserPassword string
	hs.DB.Model(&models.User{}).Select("password").Where("id = ?", createdUser.ID).First(&createdUserPassword)

	userUpdates := models.User{
		StrID:    createdUser.StrID,
		Email:    "test2@test.com",
		Password: "newPassword",
		Forename: "<h1>test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(userUpdates, testServer)
	require.NoError(t, reqErr)
	defer res.Body.Close()
	require.Equal(t, http.StatusOK, res.StatusCode)

	var expectedUserPassword string
	hs.DB.Model(&models.User{}).Select("password").Where("id = ?", createdUser.ID).First(&expectedUserPassword)

	require.Equal(t, expectedUserPassword, createdUserPassword)
}

func (hs *UserHandlersSuite) TestUserUpdateWillNotChangeScales() {

	t := hs.T()

	//Setup the user, with a scale

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)

	originalScaleName := "test1"
	scale := models.Scale{
		Name:            originalScaleName,
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories:      []models.Category{},
		UserID:          createdUser.ID,
	}

	hs.DB.Create(&scale)
	scale.ResolveID()

	//Now update the user, while trying to change the name of the scale
	updatedUser := user
	updatedUser.StrID = createdUser.StrID
	updatedUser.Email = "test2@test.com"
	scale.Name = "test2"
	updatedUser.Scales = append(updatedUser.Scales, scale)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(updatedUser, testServer)
	require.NoError(t, reqErr)
	defer res.Body.Close()
	require.Equal(t, http.StatusOK, res.StatusCode)

	var dbScale models.Scale
	hs.DB.Model(&models.Scale{}).First(&dbScale)

	require.Equal(t, originalScaleName, dbScale.Name)
}

func (hs *UserHandlersSuite) TestUserUpdateWillNotCreateScales() {

	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)
	createdUser.ResolveID()

	updatedUser := createdUser
	updatedUser.Scales = append(updatedUser.Scales, models.Scale{
		Name:            "test1",
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories:      []models.Category{},
		UserID:          createdUser.ID,
	})

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(updatedUser, testServer)
	require.NoError(t, reqErr)
	defer res.Body.Close()

	var dbScaleCount int64
	hs.DB.Model(&models.Scale{}).Count(&dbScaleCount)

	require.Equal(t, int64(0), dbScaleCount)
}

func (hs *UserHandlersSuite) TestUserUpdateWillNotDeleteScales() {

	t := hs.T()

	user := models.User{
		Email:    "test@test.com",
		Password: "password",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.Service.Create(user)

	scale := models.Scale{
		Name:            "test1",
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories:      []models.Category{},
		UserID:          createdUser.ID, //attached to this user
	}

	hs.DB.Create(&scale)
	scale.ResolveID()

	//Updated user shouldn't have the scales (just like createdUer variable currently doesnt)
	updatedUser := createdUser

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.PUT("/", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	res, reqErr := putUser(updatedUser, testServer)
	require.NoError(t, reqErr)
	defer res.Body.Close()

	var dbScaleCount int64
	hs.DB.Model(&models.Scale{}).Count(&dbScaleCount)

	require.Equal(t, int64(1), dbScaleCount)

}
