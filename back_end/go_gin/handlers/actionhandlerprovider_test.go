package handlers_test

import (
	"log"
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

type ActionHandlersSuite struct {
	suite.Suite
	DB          *gorm.DB
	Service     services.ActionService
	UserService services.UserService
	Handler     handlers.ActionHandlerProvider
}

func (hs *ActionHandlersSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	hs.DB = db
	hs.Service = services.ActionService{DB: db}
	hs.UserService = services.UserService{DB: db}
	hs.Handler = handlers.ActionHandlerProvider{DB: db, Service: hs.Service, CategoryService: services.CategoryService{DB: db}}
}

func TestActionHandlerSuite(t *testing.T) {
	suite.Run(t, new(ActionHandlersSuite))
}

// -- Create ------------------------------------------------------------------------

func (hs *ActionHandlersSuite) TestCreateWillCreateAnActionUnderTheCorrectCategory() {

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
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newAction := models.Action{
		Name:   "action1",
		Weight: 1,
	}

	resultAct, resErr := postAction(t, testServer.URL+"/1/1/", newAction)
	require.NoError(t, resErr)

	require.Equal(t, newAction.Name, resultAct.Name)
	require.Equal(t, newAction.Weight, resultAct.Weight)
	require.Equal(t, uint64(1), resultAct.CategoryID)

	//Make sure saved changes
	resultAct.ResolveID()
	savedAct, _ := hs.Service.Get(resultAct.StrID)

	require.Equal(t, resultAct.Name, savedAct.Name)
	require.Equal(t, resultAct.Weight, savedAct.Weight)
	require.Equal(t, uint64(1), savedAct.CategoryID)
}

func (hs *ActionHandlersSuite) TestCreateWillReturnActionValidationError() {

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
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newAction := models.Action{
		Name:   "", //empty name, so should fail validation
		Weight: 1,
	}

	_, resErr := postAction(t, testServer.URL+"/1/1/", newAction)
	require.Error(t, resErr)
}

func (hs *ActionHandlersSuite) TestCreateWillCallSanitiseOnAction() {

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
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newAction := models.Action{
		Name:   "<test>", //< and > braces should get replaced
		Weight: 1,
	}

	expectedName := "&lt;test&gt;"

	resultAct, resErr := postAction(t, testServer.URL+"/1/1/", newAction)
	require.NoError(t, resErr)
	require.Equal(t, expectedName, resultAct.Name)

	//Make sure saved changes
	resultAct.ResolveID()
	savedAct, _ := hs.Service.Get(resultAct.StrID)
	require.Equal(t, expectedName, savedAct.Name)
}

func (hs *ActionHandlersSuite) TestCreateWillReturn401IfCategoryDoesntBelongToAuthUser() {

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
						Actions:       []models.Action{},
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
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)
	hs.DB.Create(&otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/:categoryid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newAction := models.Action{
		Name:   "test",
		Weight: 1,
	}

	_, resErr := postAction(t, testServer.URL+"/2/2/", newAction) //not the auth user's scale/category
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

// -- Update ----------------------------------------------------------------------

func (hs *ActionHandlersSuite) TestUpdateWillUpdateTheCorrectAction() {

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
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:   "test1",
								Weight: 1,
							},
							{
								Name:   "test",
								Weight: 5,
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
	r.PUT("/:scaleid/:categoryid/:actionid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newActionData := models.Action{ //Purposefully using incorrect IDs, to ensure they're ignored
		ID:     52,
		StrID:  "52",
		Name:   "test2",
		Weight: 2,
	}

	resultAct, resErr := putAction(t, testServer.URL+"/1/1/1", newActionData) // 1 should be the id
	require.NoError(t, resErr)

	require.Equal(t, newActionData.Name, resultAct.Name)
	require.Equal(t, newActionData.Weight, resultAct.Weight)

	//Make sure saved changes
	resultAct.ResolveID()
	savedAct, _ := hs.Service.Get(resultAct.StrID)

	require.Equal(t, resultAct.Name, savedAct.Name)
	require.Equal(t, resultAct.Weight, savedAct.Weight)
}

func (hs *ActionHandlersSuite) TestUpdateWillNotUpdateTheActionIfItBelongsToAnotherUser() {

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
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:   "test1",
								Weight: 1,
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
						Name:          "test2",
						Color:         "red",
						DesiredWeight: 1,
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)
	hs.DB.Create(&otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", otherUser) }) // Not the action owner
	r.PUT("/:scaleid/:categoryid/:actionid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newActData := models.Action{
		Name:   "test2",
		Weight: 2,
	}

	_, resErr := putAction(t, testServer.URL+"/1/1/1", newActData) // 1 should be the id
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

func (hs *ActionHandlersSuite) TestUpdateWillReturn404IfActionNotFound() {

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
						Color:         "red",
						DesiredWeight: 1,
						Actions:       []models.Action{},
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/:scaleid/:categoryid/:actionid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newActData := models.Action{
		Name:   "test2",
		Weight: 2,
	}

	_, resErr := putAction(t, testServer.URL+"/1/1/1", newActData) // No actions exist
	require.Error(t, resErr)
	require.Equal(t, "404", resErr.Error())
}

func (hs *ActionHandlersSuite) TestUpdateWillSanitiseTheNewActionData() {

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
						Color:         "red",
						DesiredWeight: 1,
						Actions: []models.Action{
							{
								Name:   "test1",
								Weight: 1,
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
	r.PUT("/:scaleid/:categoryid/:actionid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newActData := models.Action{
		Name:   "< action2 >",
		Weight: 2,
	}

	resultAct, resErr := putAction(t, testServer.URL+"/1/1/1", newActData) // 1 should be the id
	require.NoError(t, resErr)

	require.Equal(t, "&lt; action2 &gt;", resultAct.Name)

	//Make sure saved changes
	resultAct.ResolveID()
	savedAct, _ := hs.Service.Get(resultAct.StrID)

	require.Equal(t, resultAct.Name, savedAct.Name)
}

// -- Delete --------------------------------------------------------

func (hs *ActionHandlersSuite) TestDeleteWillDeleteTheCorrectAction() {

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
							},
							{
								Name:   "test2",
								Weight: 2,
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
	r.DELETE("/:scaleid/:categoryid/:actionid", hs.Handler.DeleteHandler)

	testServer := httptest.NewServer(r)

	resErr := customtestutils.DeleteEntity(t, testServer.URL+"/1/1/1") // delete the first
	require.NoError(t, resErr)

	var actions []models.Action
	hs.DB.Find(&actions)
	require.Equal(t, 1, len(actions)) //Should only be the second one left
	require.Equal(t, uint64(2), actions[0].ID)
}

func (hs *ActionHandlersSuite) TestDeleteWillNotDeleteAnActionIfItBelongsToAnotherUser() {

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
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", otherUser) }) //No actions belong to this user
	r.DELETE("/:scaleid/:categoryid/:actionid", hs.Handler.DeleteHandler)

	testServer := httptest.NewServer(r)

	resErr := customtestutils.DeleteEntity(t, testServer.URL+"/1/1/1")
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}
