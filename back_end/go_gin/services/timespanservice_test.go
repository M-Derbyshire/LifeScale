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

type TimespanServiceSuite struct {
	suite.Suite
	DB *gorm.DB
}

func (s *TimespanServiceSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	s.DB = db
}

func TestTimespanServiceSuite(t *testing.T) {
	suite.Run(t, new(TimespanServiceSuite))
}

// -- Get ---------------------------------------------------------------

func (s *TimespanServiceSuite) TestGetReturnsErrorWhenTimespanDoesntExist() {

	tsId := "1"
	service := services.TimespanService{DB: s.DB}

	_, err := service.Get(tsId)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *TimespanServiceSuite) TestGetReturnsTimespanWithResolvedIDs() {

	t := s.T()

	tsId := uint64(1)
	strTsId := "1"
	service := services.TimespanService{DB: s.DB}

	expectedTimespan := models.Timespan{
		Date:        time.Now().UTC(),
		MinuteCount: 1,
	}

	createResult := s.DB.Create(&expectedTimespan)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(strTsId)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, tsId, result.ID)
	require.Equal(t, strTsId, result.StrID) // IDs should be resolved
	require.Equal(t, expectedTimespan.Date, result.Date)
	require.Equal(t, expectedTimespan.MinuteCount, result.MinuteCount)
}

// -- Create -------------------------------------------------------

func (s *TimespanServiceSuite) TestCreateCreatesTimespanAndReturnsWithResolvedID() {

	//First create an action for the timespan
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

	_, userErr := userService.Create(newUser)
	if userErr != nil {
		require.NoError(s.T(), userErr)
	}

	tsId := uint64(1)
	strTsId := "1"
	service := services.TimespanService{DB: s.DB}

	newTimespan := models.Timespan{
		Date:        time.Now().UTC(),
		MinuteCount: 1,
		ActionID:    1,
	}

	expectedTimespan := newTimespan
	expectedTimespan.StrID = strTsId
	expectedTimespan.ID = tsId

	result, actErr := service.Create(expectedTimespan)
	if actErr != nil {
		require.NoError(s.T(), actErr)
	}

	//Check equality
	require.Equal(s.T(), uint64(1), result.ID)
	require.Equal(s.T(), "1", result.StrID) // IDs should be resolved
	require.Equal(s.T(), expectedTimespan.Date, result.Date)
	require.Equal(s.T(), expectedTimespan.MinuteCount, result.MinuteCount)

	require.Equal(s.T(), uint64(1), result.ActionID)
}

func (s *TimespanServiceSuite) TestCreateReturnsErrorFromDatabase() {

	tsId := uint64(1)
	strTsId := "1"
	service := services.TimespanService{DB: s.DB}

	newTimespan := models.Timespan{
		ID:          tsId,
		StrID:       strTsId,
		Date:        time.Now().UTC(),
		MinuteCount: 1,
	}

	service.Create(newTimespan)           //creating with explicit ID (models stop this from happening through the json at request-time)
	_, err := service.Create(newTimespan) //creating again, with same ID, to cause error
	require.Error(s.T(), err)
}

// -- Delete -----------------------------------------------------

func (s *TimespanServiceSuite) TestDeleteWillDeleteATimespan() {

	service := services.TimespanService{DB: s.DB}

	origTimespan := models.Timespan{
		Date:        time.Now().UTC(),
		MinuteCount: 1,
		ActionID:    1,
	}

	createErr := s.DB.Create(&origTimespan).Error
	if createErr != nil {
		require.NoError(s.T(), createErr)
	}

	delErr := service.Delete(1)
	if delErr != nil {
		require.NoError(s.T(), delErr)
	}

	var tsCount int64
	countErr := s.DB.Model(&models.Timespan{}).Count(&tsCount).Error
	if countErr != nil {
		require.NoError(s.T(), countErr)
	}

	require.Equal(s.T(), int64(0), tsCount)
}

func (s *TimespanServiceSuite) TestDeleteWillReturnAnErrorIfTheresAnError() {

	service := services.TimespanService{DB: s.DB}

	delErr := service.Delete(1) //non-existant timespan

	require.NoError(s.T(), delErr)
}
