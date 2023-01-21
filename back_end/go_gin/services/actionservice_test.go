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

type ActionServiceSuite struct {
	suite.Suite
	DB *gorm.DB
}

func (s *ActionServiceSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	s.DB = db
}

func TestActionServiceSuite(t *testing.T) {
	suite.Run(t, new(ActionServiceSuite))
}

// -- Get ---------------------------------------------------------------

func (s *ActionServiceSuite) TestGetReturnsErrorWhenActionDoesntExist() {

	actId := "1"
	service := services.ActionService{DB: s.DB}

	_, err := service.Get(actId)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *ActionServiceSuite) TestGetReturnsActionWithResolvedIDs() {

	t := s.T()

	actId := uint64(1)
	strActId := "1"
	service := services.ActionService{DB: s.DB}

	expectedAction := models.Action{
		Name:   "action1",
		Weight: 1,
		Timespans: []models.Timespan{
			{
				Date:        time.Now().UTC(),
				MinuteCount: 1,
			},
		},
	}

	createResult := s.DB.Create(&expectedAction)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(strActId)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, actId, result.ID)
	require.Equal(t, strActId, result.StrID) // IDs should be resolved
	require.Equal(t, expectedAction.Name, result.Name)
	require.Equal(t, expectedAction.Weight, result.Weight)

	// Check we have no descendant entities
	require.Equal(t, 0, len(result.Timespans))
}

// -- Create --------------------------------------------------------------------------

func (s *ActionServiceSuite) TestCreateCreatesActionAndReturnsWithResolvedID() {

	//First create a user/scale for the category
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

	_, userErr := userService.Create(newUser)
	if userErr != nil {
		require.NoError(s.T(), userErr)
	}

	actId := uint64(1)
	strActId := "1"
	service := services.ActionService{DB: s.DB}

	newAction := models.Action{
		Name:   "action1",
		Weight: 1,
		Timespans: []models.Timespan{
			{
				Date:        time.Now().UTC(),
				MinuteCount: 1,
			},
		},
		CategoryID: 1,
	}

	expectedAction := newAction
	expectedAction.StrID = strActId
	expectedAction.ID = actId

	result, actErr := service.Create(expectedAction)
	if actErr != nil {
		require.NoError(s.T(), actErr)
	}

	//Check equality
	require.Equal(s.T(), uint64(1), result.ID)
	require.Equal(s.T(), "1", result.StrID) // IDs should be resolved
	require.Equal(s.T(), expectedAction.Name, result.Name)
	require.Equal(s.T(), expectedAction.Weight, result.Weight)

	require.Equal(s.T(), uint64(1), result.CategoryID)
	require.Equal(s.T(), 0, len(result.Timespans)) //Timespans should not be saved through this method
}

func (s *ActionServiceSuite) TestCreateReturnsErrorFromDatabase() {

	actId := uint64(1)
	strActId := "1"
	service := services.ActionService{DB: s.DB}

	newAction := models.Action{
		ID:        actId,
		StrID:     strActId,
		Name:      "action1",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	service.Create(newAction)           //creating with explicit ID (models stop this from happening through the json at request-time)
	_, err := service.Create(newAction) //creating again, with same ID, to cause error
	require.Error(s.T(), err)
}

// -- Update --------------------------------------------------------

func (s *ActionServiceSuite) TestUpdateWillUpdateTheActionAndReturnItWithResolvedId() {

	service := services.ActionService{DB: s.DB}

	origAct := models.Action{
		Name:      "action1",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	createErr := s.DB.Create(&origAct).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newActData := models.Action{
		ID:        origAct.ID,
		StrID:     "",
		Name:      "action2",
		Weight:    2,
		Timespans: []models.Timespan{},
	}

	result, updateErr := service.Update(newActData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	newActData.ResolveID()
	require.Equal(s.T(), newActData.ID, result.ID)
	require.Equal(s.T(), newActData.StrID, result.StrID)
	require.Equal(s.T(), newActData.Name, result.Name)
	require.Equal(s.T(), newActData.Weight, result.Weight)

	//Also make sure the data was actually saved, not just returned
	var dbAct models.Action
	dbGetErr := s.DB.First(&dbAct, result.ID).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), newActData.Name, dbAct.Name)
	require.Equal(s.T(), newActData.Weight, dbAct.Weight)
}

func (s *ActionServiceSuite) TestUpdateCannotUpdateTimespans() {

	service := services.ActionService{DB: s.DB}

	origAct := models.Action{
		Name:   "action1",
		Weight: 1,
		Timespans: []models.Timespan{
			{
				Date:        time.Now().UTC(),
				MinuteCount: 1,
			},
		},
	}

	createErr := s.DB.Create(&origAct).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newActData := models.Action{
		ID:     origAct.ID,
		Name:   "action2",
		Weight: 2,
		Timespans: []models.Timespan{
			{
				ID:          origAct.Timespans[0].ID,
				Date:        time.Now().UTC(),
				MinuteCount: 5,
			},
		},
	}

	_, updateErr := service.Update(newActData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	var dbTimespan models.Timespan
	dbGetErr := s.DB.First(&dbTimespan, 1).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), origAct.Timespans[0].MinuteCount, dbTimespan.MinuteCount)
}

func (s *ActionServiceSuite) TestUpdateCannotUpdateParentCategoryId() {
	service := services.ActionService{DB: s.DB}

	origAct := models.Action{
		Name:      "action1",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	secondCategory := models.Category{
		Name:          "category2",
		Color:         "blue",
		DesiredWeight: 1,
		Actions:       []models.Action{},
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
				Categories: []models.Category{
					{
						Name:          "category1",
						Color:         "red",
						DesiredWeight: 1,
						Actions:       []models.Action{origAct},
					},
					secondCategory,
				},
			},
		},
	}

	//Create two new categories
	createErr := s.DB.Create(&user1).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	newActData := models.Action{
		ID:         1,
		Name:       "action1",
		Weight:     1,
		Timespans:  []models.Timespan{},
		CategoryID: 2, // Dont want to change this
	}

	result, updateErr := service.Update(newActData)
	if updateErr != nil {
		require.NoError(s.T(), updateErr)
	}

	var dbAct models.Action
	dbGetErr := s.DB.First(&dbAct, result.ID).Error
	if dbGetErr != nil {
		require.NoError(s.T(), dbGetErr)
	}

	require.Equal(s.T(), uint64(1), dbAct.CategoryID) // Not changed
}

// -- Delete ----------------------------------------------------------

func (s *ActionServiceSuite) TestDeleteWillDeleteAnAction() {

	service := services.ActionService{DB: s.DB}

	origAct := models.Action{
		Name:      "action1",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	createErr := s.DB.Create(&origAct).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	delErr := service.Delete(1)
	if delErr != nil {
		require.NoError(s.T(), delErr)
	}

	var actCount int64
	countErr := s.DB.Model(&models.Action{}).Count(&actCount).Error
	if countErr != nil {
		require.NoError(s.T(), countErr)
	}

	require.Equal(s.T(), int64(0), actCount)
}

func (s *ActionServiceSuite) TestDeleteWillReturnAnErrorIfTheresAnError() {

	service := services.ActionService{DB: s.DB}

	delErr := service.Delete(1) //non-existant action

	require.NoError(s.T(), delErr)
}
