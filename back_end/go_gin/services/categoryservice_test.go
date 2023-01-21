package services_test

import (
	"log"
	"testing"

	customtestutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_test_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type CategoryServiceSuite struct {
	suite.Suite
	DB *gorm.DB
}

func (s *CategoryServiceSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	s.DB = db
}

func TestCategoryServiceSuite(t *testing.T) {
	suite.Run(t, new(CategoryServiceSuite))
}

// -- Get --------------------------------------------------------------------

func (s *CategoryServiceSuite) TestGetReturnsErrorWhenCategoryDoesntExist() {

	catId := "1"
	service := services.CategoryService{DB: s.DB}

	_, err := service.Get(catId)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *CategoryServiceSuite) TestGetReturnsCategoryWithResolvedIDs() {

	t := s.T()

	catId := uint64(1)
	strCatId := "1"
	service := services.CategoryService{DB: s.DB}

	expectedCategory := models.Category{
		ID:            1,
		StrID:         "1",
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
	}

	createResult := s.DB.Create(&expectedCategory)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(strCatId)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, catId, result.ID)
	require.Equal(t, expectedCategory.StrID, result.StrID) // IDs should be resolved
	require.Equal(t, expectedCategory.Name, result.Name)
	require.Equal(t, expectedCategory.Color, result.Color)
	require.Equal(t, expectedCategory.DesiredWeight, result.DesiredWeight)

	// Check we have no descendant entities
	require.Equal(t, 0, len(result.Actions))
}

// -- Create -------------------------------------------------------------------

func (s *CategoryServiceSuite) TestCreateCreatesCategoryAndReturnsWithResolvedID() {

	//First create a user and scale for the category
	userService := services.UserService{DB: s.DB}

	newUser := models.User{
		ID:       0,
		StrID:    "",
		Email:    "test42344@test.com",
		Password: "test",
		Forename: "test",
		Surname:  "testadkdkajdj",
		Scales: []models.Scale{
			{
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	_, userErr := userService.Create(newUser)
	if userErr != nil {
		require.NoError(s.T(), userErr)
	}

	catId := uint64(1)
	strCatId := "1"
	service := services.CategoryService{DB: s.DB}

	newCategory := models.Category{
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
		ScaleID: 1,
	}

	expectedCategory := newCategory
	expectedCategory.StrID = strCatId
	expectedCategory.ID = catId

	result, catErr := service.Create(newCategory)
	if catErr != nil {
		require.NoError(s.T(), catErr)
	}

	//Check equality
	require.Equal(s.T(), uint64(1), result.ID)
	require.Equal(s.T(), "1", result.StrID) // IDs should be resolved
	require.Equal(s.T(), expectedCategory.Name, result.Name)
	require.Equal(s.T(), expectedCategory.Color, result.Color)
	require.Equal(s.T(), expectedCategory.DesiredWeight, result.DesiredWeight)

	require.Equal(s.T(), uint64(1), result.ScaleID)
	require.Equal(s.T(), 0, len(result.Actions)) //Actions should not be saved through this method
}

func (s *CategoryServiceSuite) TestCreateReturnsErrorFromDatabase() {

	catId := uint64(1)
	strCatId := "1"
	service := services.CategoryService{DB: s.DB}

	newCategory := models.Category{
		ID:            catId,
		StrID:         strCatId,
		Name:          "category1",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	service.Create(newCategory)           //creating with explicit ID (models stop this from happening through the json at request-time)
	_, err := service.Create(newCategory) //creating again, with same ID, to cause error
	require.Error(s.T(), err)
}

// -- Update -------------------------------------------------------------------

func (s *CategoryServiceSuite) TestUpdateWillUpdateTheCategoryAndReturnItWithResolvedId() {

	service := services.CategoryService{DB: s.DB}

	origCat := models.Category{
		ID:            0,
		Name:          "category1",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	createErr := s.DB.Create(&origCat).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newCatData := models.Category{
		ID:            origCat.ID,
		StrID:         "",
		Name:          "category2",
		Color:         "blue",
		DesiredWeight: 2,
		Actions:       []models.Action{},
	}

	result, updateErr := service.Update(newCatData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	newCatData.ResolveID()
	require.Equal(s.T(), newCatData.ID, result.ID)
	require.Equal(s.T(), newCatData.StrID, result.StrID)
	require.Equal(s.T(), newCatData.Name, result.Name)
	require.Equal(s.T(), newCatData.Color, result.Color)
	require.Equal(s.T(), newCatData.DesiredWeight, result.DesiredWeight)

	//Also make sure the data was actually saved, not just returned
	var dbCat models.Category
	dbGetErr := s.DB.First(&dbCat, result.ID).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), newCatData.Name, dbCat.Name)
	require.Equal(s.T(), newCatData.Color, dbCat.Color)
	require.Equal(s.T(), newCatData.DesiredWeight, dbCat.DesiredWeight)
}

func (s *CategoryServiceSuite) TestUpdateCannotUpdateActions() {

	service := services.CategoryService{DB: s.DB}

	origCat := models.Category{
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
	}

	createErr := s.DB.Create(&origCat).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newCatData := models.Category{
		ID:            origCat.ID,
		Name:          "category1",
		Color:         "red",
		DesiredWeight: 1,
		Actions: []models.Action{
			{
				ID:        1,
				StrID:     "1",
				Name:      "action2",
				Weight:    1,
				Timespans: []models.Timespan{},
			},
		},
	}

	_, updateErr := service.Update(newCatData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	var dbAction models.Action
	dbGetErr := s.DB.First(&dbAction, 1).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), origCat.Actions[0].Name, dbAction.Name)
}

func (s *CategoryServiceSuite) TestUpdateCannotUpdateParentScaleId() {
	service := services.CategoryService{DB: s.DB}

	origCat := models.Category{
		Name:          "category1",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	secondScale := models.Scale{
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories:      []models.Category{},
	}

	user1 := models.User{
		Email:    "test@test.com",
		Password: "test",
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 1,
				Categories:      []models.Category{origCat},
			},
			secondScale, // We want to try moving to this one
		},
	}

	//Create two new scales
	createErr := s.DB.Create(&user1).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newCatData := models.Category{
		ID:            1,
		StrID:         "1",
		Name:          "category2",
		Color:         "blue",
		DesiredWeight: 2,
		Actions:       []models.Action{},
		ScaleID:       2, // Dont want to change this
	}

	result, updateErr := service.Update(newCatData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	var dbCat models.Category
	dbGetErr := s.DB.First(&dbCat, result.ID).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), uint64(1), dbCat.ScaleID) // Not changed
}

// -- Delete -------------------------------------------------------------------

func (s *CategoryServiceSuite) TestDeleteWillDeleteACategory() {

	service := services.CategoryService{DB: s.DB}

	origCat := models.Category{
		Name:          "category1",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	createErr := s.DB.Create(&origCat).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	delErr := service.Delete(1)
	if delErr != nil {
		require.NoError(s.T(), delErr)
	}

	var catCount int64
	countErr := s.DB.Model(&models.Category{}).Count(&catCount).Error
	if countErr != nil {
		require.NoError(s.T(), countErr)
	}

	require.Equal(s.T(), int64(0), catCount)
}

func (s *CategoryServiceSuite) TestDeleteWillReturnAnErrorIfTheresAnError() {

	service := services.CategoryService{DB: s.DB}

	delErr := service.Delete(1) //non-existant category

	require.NoError(s.T(), delErr)
}
