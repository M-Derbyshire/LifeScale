package handlers_test

import (
	"log"
	"net/http/httptest"
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

type TimespanHandlersSuite struct {
	suite.Suite
	DB          *gorm.DB
	Service     services.TimespanService
	UserService services.UserService
	Handler     handlers.TimespanHandlerProvider
}

func (hs *TimespanHandlersSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	hs.DB = db
	hs.Service = services.TimespanService{DB: db}
	hs.UserService = services.UserService{DB: db}
	hs.Handler = handlers.TimespanHandlerProvider{DB: db, Service: hs.Service, ActionService: services.ActionService{DB: db}}
}

func TestTimespanHandlerSuite(t *testing.T) {
	suite.Run(t, new(TimespanHandlersSuite))
}

// -- Create ------------------------------------------------------------------------

func (hs *TimespanHandlersSuite) TestCreateWillCreateATimespanUnderTheCorrectAction() {

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
				Categories: []models.Category{
					{
						Name:          "category1",
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:      "action1",
								Weight:    1,
								Timespans: []models.Timespan{},
							},
						},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/:actionid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newTimespan := models.Timespan{
		Date:        time.Now().UTC(),
		MinuteCount: 1,
	}

	resultTs, resErr := postTimespan(t, testServer.URL+"/1/1/1/", newTimespan)
	require.NoError(t, resErr)

	require.Equal(t, newTimespan.Date, resultTs.Date)
	require.Equal(t, newTimespan.MinuteCount, resultTs.MinuteCount)
	require.Equal(t, uint64(1), resultTs.ActionID)

	//Make sure saved changes
	resultTs.ResolveID()
	savedTs, _ := hs.Service.Get(resultTs.StrID)

	require.Equal(t, resultTs.Date, savedTs.Date)
	require.Equal(t, resultTs.MinuteCount, savedTs.MinuteCount)
	require.Equal(t, uint64(1), savedTs.ActionID)
}

func (hs *TimespanHandlersSuite) TestCreateWillReturnTimespanValidationError() {

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
				Categories: []models.Category{
					{
						Name:          "category1",
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:      "action1",
								Weight:    1,
								Timespans: []models.Timespan{},
							},
						},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/:actionid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newTimespan := models.Timespan{
		Date:        time.Now().UTC(),
		MinuteCount: -1, // Negative should fail validation
	}

	_, resErr := postTimespan(t, testServer.URL+"/1/1/1/", newTimespan)
	require.Error(t, resErr)
}

func (hs *TimespanHandlersSuite) TestCreateWillReturn401IfActionDoesntBelongToAuthUser() {

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
				Categories: []models.Category{
					{
						Name:          "category1",
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:      "action1",
								Weight:    1,
								Timespans: []models.Timespan{},
							},
						},
					},
				},
			},
		},
	}

	otherUser := models.User{
		StrID:    "2",
		Email:    "test2@test.com",
		Forename: "test2",
		Surname:  "test2",
		Scales: []models.Scale{
			{
				Name:            "scale2",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories: []models.Category{
					{
						Name:          "category2",
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:      "action2",
								Weight:    1,
								Timespans: []models.Timespan{},
							},
						},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)
	hs.DB.Create(&otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/:actionid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newTimespan := models.Timespan{
		Date:        time.Now().UTC(),
		MinuteCount: 1,
	}

	_, resErr := postTimespan(t, testServer.URL+"/2/2/2/", newTimespan) //not the auth user's scale/category/action
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

// -- Delete ----------------------------------------------------------------------

func (hs *TimespanHandlersSuite) TestDeleteWillDeleteTheCorrectTimespan() {

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
				Categories: []models.Category{
					{
						Name:          "test1",
						Color:         "blue",
						DesiredWeight: 2,
						Actions: []models.Action{
							{
								Name:   "test1",
								Weight: 1,
								Timespans: []models.Timespan{
									{
										Date:        time.Now().UTC(),
										MinuteCount: 1,
									},
									{
										Date:        time.Now().UTC(),
										MinuteCount: 2,
									},
								},
							},
						},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.DELETE("/:scaleid/:categoryid/:actionid/:id", hs.Handler.DeleteHandler)

	testServer := httptest.NewServer(r)

	resErr := customtestutils.DeleteEntity(t, testServer.URL+"/1/1/1/1") // delete the first
	require.NoError(t, resErr)

	var timespans []models.Timespan
	hs.DB.Find(&timespans)
	require.Equal(t, 1, len(timespans)) //Should only be the second one left
	require.Equal(t, uint64(2), timespans[0].ID)
}

func (hs *TimespanHandlersSuite) TestDeleteWillNotDeleteATimespanIfItBelongsToAnotherUser() {

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
				Categories: []models.Category{
					{
						Name:          "test1",
						Color:         "blue",
						DesiredWeight: 2,
						Actions: []models.Action{
							{
								Name:   "test1",
								Weight: 1,
								Timespans: []models.Timespan{
									{
										Date:        time.Now().UTC(),
										MinuteCount: 1,
									},
								},
							},
						},
					},
				},
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
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", otherUser) }) //No timespans belong to this user
	r.DELETE("/:scaleid/:categoryid/:actionid/:id", hs.Handler.DeleteHandler)

	testServer := httptest.NewServer(r)

	resErr := customtestutils.DeleteEntity(t, testServer.URL+"/1/1/1/1")
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}
