package handlers_test

import (
	"bytes"
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

func handleScaleResponse(res *http.Response) (models.Scale, error) {
	if res.StatusCode < 200 || res.StatusCode > 299 {
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

//Get a scale model from the GET endpoint. If statuscode is not 200, then the returned error will be a string of the code
func getScale(t *testing.T, url string) (models.Scale, error) {
	res, reqErr := http.Get(url)
	if reqErr != nil {
		return models.Scale{}, reqErr
	}
	defer res.Body.Close()

	return handleScaleResponse(res)
}

//Run a scale POST request. If statuscode is not 200, then the returned error will be a string of the code
func postScale(t *testing.T, url string, scale models.Scale) (models.Scale, error) {
	reqJson, _ := json.Marshal(scale)
	reqBody := bytes.NewBuffer(reqJson)
	res, reqErr := http.Post(url, "application/json", reqBody)

	if reqErr != nil {
		return models.Scale{}, reqErr
	}
	defer res.Body.Close()

	return handleScaleResponse(res)
}

//Run a scale PUT request. If statuscode is not 200, then the returned error will be a string of the code
func putScale(t *testing.T, url string, scaleData models.Scale) (models.Scale, error) {
	reqJson, _ := json.Marshal(scaleData)
	req, reqErr := http.NewRequest(http.MethodPut, url, bytes.NewReader(reqJson))
	if reqErr != nil {
		return models.Scale{}, reqErr
	}

	client := &http.Client{}
	res, resErr := client.Do(req)
	if resErr != nil {
		return models.Scale{}, resErr
	}
	defer res.Body.Close()

	return handleScaleResponse(res)
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
	r.GET("/:id/", hs.Handler.RetrievalHandler)

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
	r.GET("/:id/", hs.Handler.RetrievalHandler)

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
	r.GET("/:id/", hs.Handler.RetrievalHandler)

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
	r.GET("/:id/", hs.Handler.RetrievalHandler)

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
	r.GET("/:id/", hs.Handler.RetrievalHandler)

	testServer := httptest.NewServer(r)

	_, resErr := getScale(t, testServer.URL+"/1/")
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

// -- Create ------------------------------------------------------------------------

func (hs *ScaleHandlersSuite) TestCreateWillCreateAScaleUnderTheAuthUser() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	otherUser := models.User{
		StrID:    "2",
		Email:    "test2@test.com",
		Forename: "test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	hs.UserService.Create(user)
	hs.UserService.Create(otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newScale := models.Scale{
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 3,
	}

	resultScale, resErr := postScale(t, testServer.URL+"/", newScale)
	require.NoError(t, resErr)

	require.Equal(t, newScale.Name, resultScale.Name)
	require.Equal(t, newScale.UsesTimespans, resultScale.UsesTimespans)
	require.Equal(t, newScale.DisplayDayCount, resultScale.DisplayDayCount)
	require.Equal(t, uint64(1), resultScale.UserID)

	//Make sure saved changes
	resultScale.ResolveID()
	savedScale, _ := hs.Service.Get(resultScale.StrID, services.AllTimespans)

	require.Equal(t, resultScale.Name, savedScale.Name)
	require.Equal(t, resultScale.UsesTimespans, savedScale.UsesTimespans)
	require.Equal(t, resultScale.DisplayDayCount, savedScale.DisplayDayCount)
	require.Equal(t, uint64(1), savedScale.UserID)
}

func (hs *ScaleHandlersSuite) TestCreateWillReturnScaleValidationError() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	hs.UserService.Create(user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newScale := models.Scale{
		Name:            "", //empty name, so should fail validation
		UsesTimespans:   true,
		DisplayDayCount: 3,
	}

	_, resErr := postScale(t, testServer.URL+"/", newScale)
	require.Error(t, resErr)
}

func (hs *ScaleHandlersSuite) TestCreateWillCallSanitiseOnScale() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	hs.UserService.Create(user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newScale := models.Scale{
		Name:            "<test>", //< and > braces should get replaced
		UsesTimespans:   true,
		DisplayDayCount: 3,
	}

	expectedName := "&lt;test&gt;"

	resultScale, resErr := postScale(t, testServer.URL+"/", newScale)
	require.NoError(t, resErr)
	require.Equal(t, expectedName, resultScale.Name)

	//Make sure saved changes
	resultScale.ResolveID()
	savedScale, _ := hs.Service.Get(resultScale.StrID, services.AllTimespans)
	require.Equal(t, expectedName, savedScale.Name)
}

// -- Update ----------------------------------------------------------------------

func (hs *ScaleHandlersSuite) TestUpdateWillUpdateTheCorrectScale() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/:id", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newScaleData := models.Scale{ //Purposefully using incorrect IDs, to ensure they're ignored
		ID:              52,
		StrID:           "52",
		Name:            "scale2",
		UsesTimespans:   false,
		DisplayDayCount: 8,
	}

	resultScale, resErr := putScale(t, testServer.URL+"/1", newScaleData) // 1 should be the id
	require.NoError(t, resErr)

	require.Equal(t, newScaleData.Name, resultScale.Name)
	require.Equal(t, newScaleData.UsesTimespans, resultScale.UsesTimespans)
	require.Equal(t, newScaleData.DisplayDayCount, resultScale.DisplayDayCount)

	//Make sure saved changes
	resultScale.ResolveID()
	savedScale, _ := hs.Service.Get(resultScale.StrID, services.AllTimespans)

	require.Equal(t, resultScale.Name, savedScale.Name)
	require.Equal(t, resultScale.UsesTimespans, savedScale.UsesTimespans)
	require.Equal(t, resultScale.DisplayDayCount, savedScale.DisplayDayCount)
}

func (hs *ScaleHandlersSuite) TestUpdateWillNotUpdateTheScaleIfItBelongsToAnotherUser() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	otherUser := models.User{
		StrID:    "2",
		Email:    "test2@test.com",
		Forename: "test2",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	hs.DB.Create(&user)
	hs.DB.Create(&otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", otherUser) }) // Not the scale owner
	r.PUT("/:id", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newScaleData := models.Scale{
		Name:            "scale2",
		UsesTimespans:   false,
		DisplayDayCount: 8,
	}

	_, resErr := putScale(t, testServer.URL+"/1", newScaleData) // 1 should be the id
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

func (hs *ScaleHandlersSuite) TestUpdateWillReturn404IfScaleNotFound() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/:id", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newScaleData := models.Scale{
		Name:            "scale2",
		UsesTimespans:   false,
		DisplayDayCount: 8,
	}

	_, resErr := putScale(t, testServer.URL+"/1", newScaleData) // No scales exist
	require.Error(t, resErr)
	require.Equal(t, "404", resErr.Error())
}

func (hs *ScaleHandlersSuite) TestUpdateWillSanitiseTheNewScaleData() {

	t := hs.T()

	user := models.User{
		StrID:    "1",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/:id", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newScaleData := models.Scale{
		Name:            "< scale2 >",
		UsesTimespans:   false,
		DisplayDayCount: 8,
	}

	resultScale, resErr := putScale(t, testServer.URL+"/1", newScaleData) // 1 should be the id
	require.NoError(t, resErr)

	require.Equal(t, "&lt; scale2 &gt;", resultScale.Name)

	//Make sure saved changes
	resultScale.ResolveID()
	savedScale, _ := hs.Service.Get(resultScale.StrID, services.AllTimespans)

	require.Equal(t, resultScale.Name, savedScale.Name)
}

// -- Delete -------------------------------------------------------------------
