package handlers_test

import (
	"encoding/json"
	"errors"
	"io"
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
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type ScaleHandlersSuite struct {
	suite.Suite
	DB          *gorm.DB
	Service     services.ScaleService
	UserService services.UserService
	Handler     handlers.ScaleHandlerProvider
}

func (hs *ScaleHandlersSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	hs.DB = db
	hs.Service = services.ScaleService{DB: db}
	hs.UserService = services.UserService{DB: db}
	hs.Handler = handlers.ScaleHandlerProvider{DB: db, Service: hs.Service}
}

func TestScaleServiceSuite(t *testing.T) {
	suite.Run(t, new(ScaleHandlersSuite))
}

//Get a scale model from the GET endpoint. If statuscode is not 200, then the returned error will be a string of the code
func getScale(t *testing.T, url string) (models.Scale, error) {
	res, reqErr := http.Get(url)
	if reqErr != nil {
		return models.Scale{}, reqErr
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return models.Scale{}, errors.New(strconv.Itoa(res.StatusCode))
	}

	resBodyBytes, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		return models.Scale{}, readErr
	}

	var result models.Scale
	jsonErr := json.Unmarshal(resBodyBytes, &result)
	if jsonErr != nil {
		return models.Scale{}, jsonErr
	}

	return result, nil
}

// -- Get ------------------------------------------------------------------------

func (hs *ScaleHandlersSuite) TestScaleGetWillGetScaleWithAllTimespans() {

	t := hs.T()

	user := models.User{
		Email:    "test42344@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.UserService.Create(user)

	expectedScale := models.Scale{
		Name:            "scale1",
		UserID:          createdUser.ID,
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories: []models.Category{
			{
				Name:          "category1",
				Color:         "red",
				DesiredWeight: 1,
				Actions: []models.Action{
					{
						Name:   "action1",
						Weight: 1,
						Timespans: []models.Timespan{
							{
								//Adding more days then DisplayDayCount, to make sure it's returned
								Date:        time.Now().AddDate(0, 0, -5).UTC(),
								MinuteCount: 1,
							},
							{
								Date:        time.Now().UTC(),
								MinuteCount: 1,
							},
						},
					},
				},
			},
		},
	}

	scaleCreateResult := hs.DB.Create(&expectedScale)
	require.NoError(t, scaleCreateResult.Error)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.GET("/:id/", hs.Handler.ScaleRetrievalHandler)

	testServer := httptest.NewServer(r)

	result, resErr := getScale(t, testServer.URL+"/1/")
	require.NoError(t, resErr)

	require.Equal(t, expectedScale.Name, result.Name)
	require.Equal(t, expectedScale.UsesTimespans, result.UsesTimespans)
	require.Equal(t, expectedScale.DisplayDayCount, result.DisplayDayCount)

	require.Equal(t, len(expectedScale.Categories[0].Actions[0].Timespans), len(result.Categories[0].Actions[0].Timespans))
}

func (hs *ScaleHandlersSuite) TestScaleGetWillGetScaleWithLimitedTimespans() {

	t := hs.T()

	user := models.User{
		Email:    "test42344@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.UserService.Create(user)

	expectedScale := models.Scale{
		Name:            "scale1",
		UserID:          createdUser.ID,
		UsesTimespans:   true,
		DisplayDayCount: 3,
		Categories: []models.Category{
			{
				Name:          "category1",
				Color:         "red",
				DesiredWeight: 1,
				Actions: []models.Action{
					{
						Name:   "action1",
						Weight: 1,
						Timespans: []models.Timespan{
							{
								//This shouldn't be returned, as goes beyond display day
								Date:        time.Now().AddDate(0, 0, -5).UTC(),
								MinuteCount: 1,
							},
							{
								Date:        time.Now().UTC(),
								MinuteCount: 1,
							},
							{
								Date:        time.Now().AddDate(0, 0, -2).UTC(),
								MinuteCount: 1,
							},
						},
					},
				},
			},
		},
	}

	scaleCreateResult := hs.DB.Create(&expectedScale)
	require.NoError(t, scaleCreateResult.Error)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.GET("/:id/", hs.Handler.ScaleRetrievalHandler)

	testServer := httptest.NewServer(r)

	result, resErr := getScale(t, testServer.URL+"/1?daycounttimespansonly") //Here, the URL param means it should limit it
	require.NoError(t, resErr)

	require.Equal(t, 2, len(result.Categories[0].Actions[0].Timespans))
}

func (hs *ScaleHandlersSuite) TestScaleGetWillReturn404IfNotFound() {

	t := hs.T()

	user := models.User{
		Email:    "test42344@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.UserService.Create(user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", createdUser) })
	r.GET("/:id/", hs.Handler.ScaleRetrievalHandler)

	testServer := httptest.NewServer(r)

	_, resErr := getScale(t, testServer.URL+"/1?daycounttimespansonly") //Doesn't exist
	require.Error(t, resErr)
	require.Equal(t, "404", resErr.Error())
}

func (hs *ScaleHandlersSuite) TestScaleGetWillReturn500IfError() {

	t := hs.T()

	user := models.User{
		Email:    "test42344@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createdUser, _ := hs.UserService.Create(user)

	expectedScale := models.Scale{
		Name:            "scale1",
		UserID:          createdUser.ID,
		UsesTimespans:   true,
		DisplayDayCount: 3,
		Categories:      []models.Category{},
	}

	scaleCreateResult := hs.DB.Create(&expectedScale)
	require.NoError(t, scaleCreateResult.Error)

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("auth-user", struct{ BadProp string }{BadProp: "djksdjalsjd"}) //Not a valid user
		c.Next()
	})
	r.GET("/:id/", hs.Handler.ScaleRetrievalHandler)

	testServer := httptest.NewServer(r)

	_, resErr := getScale(t, testServer.URL+"/1/")
	require.Error(t, resErr)
	require.Equal(t, "500", resErr.Error())
}

func (hs *ScaleHandlersSuite) TestScaleGetWillReturn401IfScaleDoesntBelongToUser() {

	t := hs.T()

	owningUser := models.User{
		Email:    "test1@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	otherUser := models.User{
		Email:    "test2@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createdOwningUser, _ := hs.UserService.Create(owningUser)
	createdOtherUser, _ := hs.UserService.Create(otherUser)

	expectedScale := models.Scale{
		Name:            "scale1",
		UserID:          createdOwningUser.ID,
		UsesTimespans:   true,
		DisplayDayCount: 3,
		Categories:      []models.Category{},
	}

	scaleCreateResult := hs.DB.Create(&expectedScale)
	require.NoError(t, scaleCreateResult.Error)

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("auth-user", createdOtherUser) //Not the user that owns the scale
		c.Next()
	})
	r.GET("/:id/", hs.Handler.ScaleRetrievalHandler)

	testServer := httptest.NewServer(r)

	_, resErr := getScale(t, testServer.URL+"/1/")
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}
