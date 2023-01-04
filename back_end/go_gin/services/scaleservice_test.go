package services_test

import (
	"log"
	"testing"
	"time"

	customtestutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_test_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type ScaleServiceSuite struct {
	suite.Suite
	DB *gorm.DB
}

func (s *ScaleServiceSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	s.DB = db
}

func TestScaleServiceSuite(t *testing.T) {
	suite.Run(t, new(ScaleServiceSuite))
}

// Get --------------------------------------------------------------------------------------

func (s *ScaleServiceSuite) TestGetReturnsErrorWhenScaleDoesntExist() {

	scaleId := "1"
	service := services.ScaleService{DB: s.DB}

	_, err := service.Get(scaleId, false)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *ScaleServiceSuite) TestGetReturnsScaleWithDescendantsAndResolvedIDs() {

	t := s.T()

	scaleId := uint64(1)
	strScaleId := "1"
	service := services.ScaleService{DB: s.DB}

	expectedScale := models.Scale{
		ID:              scaleId,
		StrID:           strScaleId,
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories: []models.Category{
			{
				ID:            1,
				StrID:         "1",
				Name:          "category1",
				Color:         "red",
				DesiredWeight: 1,
				Actions: []models.Action{
					{
						ID:     1,
						StrID:  "1",
						Name:   "action1",
						Weight: 1,
						Timespans: []models.Timespan{
							{
								ID:    1,
								StrID: "1",
								//Adding more days then DisplayDayCount, to make sure it's returned
								Date:        time.Now().AddDate(0, 0, -5).UTC(),
								MinuteCount: 1,
							},
							{
								ID:          2,
								StrID:       "2",
								Date:        time.Now().UTC(),
								MinuteCount: 1,
							},
						},
					},
					{
						ID:        2,
						StrID:     "2",
						Name:      "action2",
						Weight:    1,
						Timespans: []models.Timespan{},
					},
				},
			},
			{
				ID:            2,
				StrID:         "2",
				Name:          "category2",
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			},
		},
	}

	createResult := s.DB.Create(&expectedScale)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(strScaleId, false)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, scaleId, result.ID)
	require.Equal(t, expectedScale.StrID, result.StrID) // IDs should be resolved
	require.Equal(t, expectedScale.Name, result.Name)
	require.Equal(t, expectedScale.UsesTimespans, result.UsesTimespans)
	require.Equal(t, expectedScale.DisplayDayCount, result.DisplayDayCount)

	// Check the descendant entities
	require.Equal(t, len(expectedScale.Categories), len(expectedScale.Categories))
	expectedCategories := expectedScale.Categories
	for catIdx, cat := range result.Categories {
		require.Equal(t, expectedCategories[catIdx].ID, cat.ID)
		require.Equal(t, expectedCategories[catIdx].StrID, cat.StrID)
		require.Equal(t, expectedCategories[catIdx].Name, cat.Name)
		require.Equal(t, expectedCategories[catIdx].Color, cat.Color)
		require.Equal(t, expectedCategories[catIdx].DesiredWeight, cat.DesiredWeight)

		require.Equal(t, len(expectedCategories[catIdx].Actions), len(cat.Actions))
		expectedActions := expectedCategories[catIdx].Actions
		for actIdx, act := range cat.Actions {
			require.Equal(t, expectedActions[actIdx].ID, act.ID)
			require.Equal(t, expectedActions[actIdx].StrID, act.StrID)
			require.Equal(t, expectedActions[actIdx].Name, act.Name)
			require.Equal(t, expectedActions[actIdx].Weight, act.Weight)

			require.Equal(t, len(expectedActions[actIdx].Timespans), len(act.Timespans))
			expectedTimespans := expectedActions[actIdx].Timespans
			for tsIdx, ts := range act.Timespans {
				require.Equal(t, expectedTimespans[tsIdx].ID, ts.ID)
				require.Equal(t, expectedTimespans[tsIdx].StrID, ts.StrID)
				require.Equal(t, expectedTimespans[tsIdx].Date, ts.Date)
				require.Equal(t, expectedTimespans[tsIdx].MinuteCount, ts.MinuteCount)
			}
		}
	}

}

func (s *ScaleServiceSuite) TestGetWillOnlyReturnTimespansUpToTheScaleDisplayDayCountIfSetTo() {
	t := s.T()
	service := services.ScaleService{DB: s.DB}

	timeToReturn := time.Now().AddDate(0, 0, -1).UTC()
	timeToIgnore := time.Now().AddDate(0, 0, -2).UTC()

	scale := models.Scale{
		ID:              1,
		StrID:           "",
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 2,
		Categories: []models.Category{
			{
				ID:            1,
				StrID:         "1",
				Name:          "category1",
				Color:         "red",
				DesiredWeight: 1,
				Actions: []models.Action{
					{
						ID:     1,
						StrID:  "1",
						Name:   "action1",
						Weight: 1,
						Timespans: []models.Timespan{
							{
								ID:          1,
								StrID:       "1",
								Date:        timeToReturn,
								MinuteCount: 1,
							},
							{
								ID:          2,
								StrID:       "2",
								Date:        timeToIgnore,
								MinuteCount: 1,
							},
						},
					},
				},
			},
		},
	}

	createResult := s.DB.Create(&scale)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, getErr := service.Get("1", true)
	if getErr != nil {
		require.NoError(t, getErr)
	}

	require.Equal(t, 1, len(result.Categories[0].Actions[0].Timespans))
	require.Equal(t, timeToReturn, result.Categories[0].Actions[0].Timespans[0].Date)
}

// Create -----------------------------------------------------------------------------------

func (s *ScaleServiceSuite) TestCreateCreatesScaleAndReturnsWithResolvedID() {

	//First create a user for the scale
	userService := services.UserService{DB: s.DB}

	newUser := models.User{
		ID:       0,
		StrID:    "",
		Email:    "test42344@test.com",
		Password: "test",
		Forename: "test",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	_, userErr := userService.Create(newUser)
	if userErr != nil {
		require.NoError(s.T(), userErr)
	}

	scaleId := uint64(1)
	strScaleId := "1"
	service := services.ScaleService{DB: s.DB}

	newScale := models.Scale{
		ID:              0,
		StrID:           "",
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories: []models.Category{
			{
				ID:            0,
				StrID:         "",
				Name:          "category1",
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			},
		},
		UserID: 1,
	}

	expectedScale := newScale
	expectedScale.StrID = strScaleId
	expectedScale.ID = scaleId

	result, scaleErr := service.Create(newScale)
	if scaleErr != nil {
		require.NoError(s.T(), scaleErr)
	}

	//Check equality
	require.Equal(s.T(), uint64(1), result.ID)
	require.Equal(s.T(), "1", result.StrID) // IDs should be resolved
	require.Equal(s.T(), expectedScale.Name, result.Name)
	require.Equal(s.T(), expectedScale.UsesTimespans, result.UsesTimespans)
	require.Equal(s.T(), expectedScale.DisplayDayCount, result.DisplayDayCount)

	require.Equal(s.T(), uint64(1), result.UserID)
	require.Equal(s.T(), 0, len(result.Categories)) //Categories should not be saved through this method
}

func (s *ScaleServiceSuite) TestCreateReturnsErrorFromDatabase() {

	scaleId := uint64(1)
	strScaleId := "1"
	service := services.ScaleService{DB: s.DB}

	newScale := models.Scale{
		ID:              1,
		StrID:           "1",
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories:      []models.Category{},
	}

	expectedScale := newScale
	expectedScale.StrID = strScaleId
	expectedScale.ID = scaleId

	service.Create(newScale)           //creating with explicit ID (models stop this from happening through the json at request-time)
	_, err := service.Create(newScale) //creating again, with same ID, to cause error
	require.Error(s.T(), err)
}

// Update -----------------------------------------------------------------------------------

func (s *ScaleServiceSuite) TestUpdateWillUpdateTheScaleAndReturnItWithResolvedId() {

	service := services.ScaleService{DB: s.DB}

	origScale := models.Scale{
		ID:              0,
		StrID:           "",
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories:      []models.Category{},
	}

	createErr := s.DB.Create(&origScale).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newScaleData := models.Scale{
		ID:              origScale.ID,
		StrID:           "",
		Name:            "scale2",
		UsesTimespans:   false,
		DisplayDayCount: 2,
		Categories:      []models.Category{},
	}

	result, updateErr := service.Update(newScaleData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	newScaleData.ResolveID()
	require.Equal(s.T(), newScaleData.ID, result.ID)
	require.Equal(s.T(), newScaleData.StrID, result.StrID)
	require.Equal(s.T(), newScaleData.Name, result.Name)
	require.Equal(s.T(), newScaleData.UsesTimespans, result.UsesTimespans)
	require.Equal(s.T(), newScaleData.DisplayDayCount, result.DisplayDayCount)

	//Also make sure the data was actually saved, not just returned
	var dbScale models.Scale
	dbGetErr := s.DB.First(&dbScale, result.ID).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), newScaleData.Name, dbScale.Name)
	require.Equal(s.T(), newScaleData.UsesTimespans, dbScale.UsesTimespans)
	require.Equal(s.T(), newScaleData.DisplayDayCount, dbScale.DisplayDayCount)
}

func (s *ScaleServiceSuite) TestUpdateCannotUpdateCategories() {

	service := services.ScaleService{DB: s.DB}

	origScale := models.Scale{
		ID:              0,
		StrID:           "",
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories: []models.Category{
			{
				Name:          "test1",
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			},
		},
	}

	createErr := s.DB.Create(&origScale).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newScaleData := models.Scale{
		ID:              origScale.ID,
		StrID:           "",
		Name:            "scale1",
		UsesTimespans:   false,
		DisplayDayCount: 2,
		Categories: []models.Category{
			{
				Name:          "test2",
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			},
		},
	}

	_, updateErr := service.Update(newScaleData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	var dbCategory models.Category
	dbGetErr := s.DB.First(&dbCategory, 1).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), origScale.Categories[0].Name, dbCategory.Name)
}

func (s *ScaleServiceSuite) TestUpdateCannotUpdateParentUserId() {
	service := services.ScaleService{DB: s.DB}

	origScale := models.Scale{
		ID:              0,
		StrID:           "",
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
		Scales:   []models.Scale{origScale},
	}

	user2 := models.User{
		Email:    "test2@test.com",
		Password: "test",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	//Create two new users
	s.DB.Create(&user1)
	createErr := s.DB.Create(&user2).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newScaleData := models.Scale{
		ID:              1,
		StrID:           "",
		Name:            "scale2",
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories:      []models.Category{},
		UserID:          2,
	}

	result, updateErr := service.Update(newScaleData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	var dbScale models.Scale
	dbGetErr := s.DB.First(&dbScale, result.ID).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), uint64(1), dbScale.UserID)
}

// Delete -----------------------------------------------------------------------------------

func (s *ScaleServiceSuite) TestDeleteWillDeleteAScale() {

	service := services.ScaleService{DB: s.DB}

	origScale := models.Scale{
		ID:              0,
		StrID:           "",
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 1,
		Categories:      []models.Category{},
	}

	createErr := s.DB.Create(&origScale).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	delErr := service.Delete(1)
	if delErr != nil {
		require.NoError(s.T(), delErr)
	}

	var scaleCount int64
	countErr := s.DB.Model(&models.Scale{}).Count(&scaleCount).Error
	if countErr != nil {
		require.NoError(s.T(), countErr)
	}

	require.Equal(s.T(), int64(0), scaleCount)
}

func (s *ScaleServiceSuite) TestDeleteWillReturnAnErrorIfTheresAnError() {

	service := services.ScaleService{DB: s.DB}

	delErr := service.Delete(1) //non-existant scale

	require.NoError(s.T(), delErr)
}
