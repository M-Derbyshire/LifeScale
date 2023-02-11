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

type CategoryHandlersSuite struct {
	suite.Suite
	DB          *gorm.DB
	Service     services.CategoryService
	UserService services.UserService
	Handler     handlers.CategoryHandlerProvider
}

func (hs *CategoryHandlersSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	hs.DB = db
	hs.Service = services.CategoryService{DB: db}
	hs.UserService = services.UserService{DB: db}
	hs.Handler = handlers.CategoryHandlerProvider{DB: db, Service: hs.Service, ScaleService: services.ScaleService{DB: db}}
}

func TestCategoryHandlerSuite(t *testing.T) {
	suite.Run(t, new(CategoryHandlersSuite))
}

// -- Create ------------------------------------------------------------------------

func (hs *CategoryHandlersSuite) TestCreateWillCreateACategoryUnderTheCorrectScale() {

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
	r.POST("/:scaleid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newCategory := models.Category{
		Name:          "category1",
		Color:         "red",
		DesiredWeight: 1,
	}

	resultCat, resErr := postCategory(t, testServer.URL+"/1/", newCategory)
	require.NoError(t, resErr)

	require.Equal(t, newCategory.Name, resultCat.Name)
	require.Equal(t, newCategory.Color, resultCat.Color)
	require.Equal(t, newCategory.DesiredWeight, resultCat.DesiredWeight)
	require.Equal(t, uint64(1), resultCat.ScaleID)

	//Make sure saved changes
	resultCat.ResolveID()
	savedCat, _ := hs.Service.Get(resultCat.StrID)

	require.Equal(t, resultCat.Name, savedCat.Name)
	require.Equal(t, resultCat.Color, savedCat.Color)
	require.Equal(t, resultCat.DesiredWeight, savedCat.DesiredWeight)
	require.Equal(t, uint64(1), savedCat.ScaleID)
}

func (hs *CategoryHandlersSuite) TestCreateWillReturnCategoryValidationError() {

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
	r.POST("/:scaleid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newCategory := models.Category{
		Name:          "", //empty name, so should fail validation
		Color:         "red",
		DesiredWeight: 1,
	}

	_, resErr := postCategory(t, testServer.URL+"/1/", newCategory)
	require.Error(t, resErr)
}

func (hs *CategoryHandlersSuite) TestCreateWillCallSanitiseOnCategory() {

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
	r.POST("/:scaleid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newCategory := models.Category{
		Name:          "<test>", //< and > braces should get replaced
		Color:         "red",
		DesiredWeight: 1,
	}

	expectedName := "&lt;test&gt;"

	resultCat, resErr := postCategory(t, testServer.URL+"/1/", newCategory)
	require.NoError(t, resErr)
	require.Equal(t, expectedName, resultCat.Name)

	//Make sure saved changes
	resultCat.ResolveID()
	savedCat, _ := hs.Service.Get(resultCat.StrID)
	require.Equal(t, expectedName, savedCat.Name)
}

func (hs *CategoryHandlersSuite) TestCreateWillReturn401IfScaleDoesntBelongToAuthUser() {

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
		Scales: []models.Scale{
			{
				Name:            "scale2",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	hs.DB.Create(&user)
	hs.DB.Create(&otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.POST("/:scaleid/", hs.Handler.CreateHandler)

	testServer := httptest.NewServer(r)

	newCategory := models.Category{
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
	}

	_, resErr := postCategory(t, testServer.URL+"/2/", newCategory) //not the auth user's scale
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

// -- Update ----------------------------------------------------------------------

func (hs *CategoryHandlersSuite) TestUpdateWillUpdateTheCorrectCategory() {

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
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/:scaleid/:categoryid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newCategoryData := models.Category{ //Purposefully using incorrect IDs, to ensure they're ignored
		ID:            52,
		StrID:         "52",
		Name:          "category2",
		Color:         "blue",
		DesiredWeight: 2,
	}

	resultCat, resErr := putCategory(t, testServer.URL+"/1/1/", newCategoryData) // 1 should be the id
	require.NoError(t, resErr)

	require.Equal(t, newCategoryData.Name, resultCat.Name)
	require.Equal(t, newCategoryData.Color, resultCat.Color)
	require.Equal(t, newCategoryData.DesiredWeight, resultCat.DesiredWeight)

	//Make sure saved changes
	resultCat.ResolveID()
	savedCat, _ := hs.Service.Get(resultCat.StrID)

	require.Equal(t, resultCat.Name, savedCat.Name)
	require.Equal(t, resultCat.Color, savedCat.Color)
	require.Equal(t, resultCat.DesiredWeight, savedCat.DesiredWeight)
}

func (hs *CategoryHandlersSuite) TestUpdateWillNotUpdateTheCategoryIfItBelongsToAnotherUser() {

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
				Categories:      []models.Category{},
			},
		},
	}

	hs.DB.Create(&user)
	hs.DB.Create(&otherUser)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", otherUser) }) // Not the category owner
	r.PUT("/:scaleid/:categoryid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newCatData := models.Category{
		Name:          "test2",
		Color:         "blue",
		DesiredWeight: 2,
	}

	_, resErr := putCategory(t, testServer.URL+"/1/1", newCatData) // 1 should be the id
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}

func (hs *CategoryHandlersSuite) TestUpdateWillReturn404IfCategoryNotFound() {

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
	r.PUT("/:scaleid/:categoryid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newCatData := models.Category{
		Name:          "test2",
		Color:         "blue",
		DesiredWeight: 2,
	}

	_, resErr := putCategory(t, testServer.URL+"/1/1", newCatData) // No categories exist
	require.Error(t, resErr)
	require.Equal(t, "404", resErr.Error())
}

func (hs *CategoryHandlersSuite) TestUpdateWillSanitiseTheNewCategoryData() {

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
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.PUT("/:scaleid/:categoryid", hs.Handler.UpdateHandler)

	testServer := httptest.NewServer(r)

	newCatData := models.Category{
		Name:          "< category2 >",
		Color:         "blue",
		DesiredWeight: 2,
	}

	resultCat, resErr := putCategory(t, testServer.URL+"/1/1", newCatData) // 1 should be the id
	require.NoError(t, resErr)

	require.Equal(t, "&lt; category2 &gt;", resultCat.Name)

	//Make sure saved changes
	resultCat.ResolveID()
	savedCat, _ := hs.Service.Get(resultCat.StrID)

	require.Equal(t, resultCat.Name, savedCat.Name)
}

// -- Delete --------------------------------------------------------

func (hs *CategoryHandlersSuite) TestDeleteWillDeleteTheCorrectCategory() {

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
					},
					{
						Name:          "test2",
						Color:         "blue",
						DesiredWeight: 2,
					},
				},
			},
		},
	}

	hs.DB.Create(&user)

	r := gin.Default()
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", user) })
	r.DELETE("/:scaleid/:categoryid", hs.Handler.DeleteHandler)

	testServer := httptest.NewServer(r)

	resErr := customtestutils.DeleteEntity(t, testServer.URL+"/1/1") // delete the first
	require.NoError(t, resErr)

	var categories []models.Category
	hs.DB.Find(&categories)
	require.Equal(t, 1, len(categories)) //Should only be the second one left
	require.Equal(t, uint64(2), categories[0].ID)
}

func (hs *CategoryHandlersSuite) TestDeleteWillNotDeleteACategoryIfItBelongsToAnotherUser() {

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
	r.Use(func(ctx *gin.Context) { ctx.Set("auth-user", otherUser) }) //No categories belong to this user
	r.DELETE("/:scaleid/:categoryid", hs.Handler.DeleteHandler)

	testServer := httptest.NewServer(r)

	resErr := customtestutils.DeleteEntity(t, testServer.URL+"/1/1")
	require.Error(t, resErr)
	require.Equal(t, "401", resErr.Error())
}
