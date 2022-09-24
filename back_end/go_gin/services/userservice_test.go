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

type UserServiceSuite struct {
	suite.Suite
	DB *gorm.DB
}

func (s *UserServiceSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	s.DB = db
}

func TestUserServiceSuite(t *testing.T) {
	suite.Run(t, new(UserServiceSuite))
}

// Get all

func (s *UserServiceSuite) TestGetAllReturnsError() {
	// Get All is not permitted for users, but to meet the IService interface, it exists (should always return an error)

	service := services.UserService{DB: s.DB}

	_, isUnauth, err := service.GetAll()

	require.Equal(s.T(), false, isUnauth)

	if err == nil {
		require.Error(s.T(), err)
	}
}

// Get

func (s *UserServiceSuite) TestGetReturnsErrorFromDatabase() {

	//Getting a user that doesn't exist, to ensure we get an error

	userId := uint64(1)
	strUserId := "1"
	service := services.UserService{DB: s.DB}

	authUser := models.User{
		ID:    userId,
		StrID: strUserId,
	}
	_, isUnauth, err := service.Get(authUser, userId)

	if err == nil {
		require.Error(s.T(), err)
	}

	require.Equal(s.T(), false, isUnauth)
}

func (s *UserServiceSuite) TestGetReturnsAuthErrorAndTrueIsUnauthValueWhenAccessNotPermitted() {

	userId := uint64(1)
	service := services.UserService{DB: s.DB}

	// Has a different user ID
	authUser := models.User{
		ID:    2,
		StrID: "2",
	}

	_, isUnauth, err := service.Get(authUser, userId)

	if err == nil {
		require.Error(s.T(), err)
	}

	require.Equal(s.T(), true, isUnauth)
}

func (s *UserServiceSuite) TestGetReturnsUserWithRelatedEntitiesAndResolvedIDs() {

	t := s.T()

	userId := uint64(1)
	strUserId := "1"
	service := services.UserService{DB: s.DB}

	expectedUser := models.User{
		ID:       userId,
		StrID:    strUserId,
		Email:    "test42344@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales: []models.Scale{
			{
				ID:              1,
				StrID:           "1",
				Name:            "scale1",
				UsesTimespans:   true,
				DisplayDayCount: 7,
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
										Date:        time.Now().UTC(),
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
			},
			{
				ID:              2,
				StrID:           "2",
				Name:            "scale2",
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	createResult := s.DB.Create(&expectedUser)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, isUnauth, err := service.Get(expectedUser, userId)

	if err != nil {
		require.NoError(t, err)
	}

	require.Equal(t, false, isUnauth)

	//Check equality
	require.Equal(t, userId, result.ID)
	require.Equal(t, expectedUser.StrID, result.StrID) // IDs should be resolved
	require.Equal(t, expectedUser.Email, result.Email)
	require.Equal(t, expectedUser.Forename, result.Forename)
	require.Equal(t, expectedUser.Surname, result.Surname)

	require.Equal(t, len(expectedUser.Scales), len(result.Scales))
	expectedScales := expectedUser.Scales
	for scaleIdx, scale := range result.Scales {
		require.Equal(t, expectedScales[scaleIdx].ID, scale.ID)
		require.Equal(t, expectedScales[scaleIdx].StrID, scale.StrID)
		require.Equal(t, expectedScales[scaleIdx].Name, scale.Name)
		require.Equal(t, expectedScales[scaleIdx].UsesTimespans, scale.UsesTimespans)
		require.Equal(t, expectedScales[scaleIdx].DisplayDayCount, scale.DisplayDayCount)

		require.Equal(t, len(expectedScales[scaleIdx].Categories), len(scale.Categories))
		expectedCategories := expectedScales[scaleIdx].Categories
		for catIdx, category := range scale.Categories {
			require.Equal(t, expectedCategories[catIdx].ID, category.ID)
			require.Equal(t, expectedCategories[catIdx].StrID, category.StrID)
			require.Equal(t, expectedCategories[catIdx].Name, category.Name)
			require.Equal(t, expectedCategories[catIdx].Color, category.Color)
			require.Equal(t, expectedCategories[catIdx].DesiredWeight, category.DesiredWeight)

			require.Equal(t, len(expectedCategories[catIdx].Actions), len(category.Actions))
			expectedActions := expectedCategories[catIdx].Actions
			for actIdx, action := range category.Actions {
				require.Equal(t, expectedActions[actIdx].ID, action.ID)
				require.Equal(t, expectedActions[actIdx].StrID, action.StrID)
				require.Equal(t, expectedActions[actIdx].Name, action.Name)
				require.Equal(t, expectedActions[actIdx].Weight, action.Weight)

				require.Equal(t, len(expectedActions[actIdx].Timespans), len(action.Timespans))
				expectedTimespans := expectedActions[actIdx].Timespans
				for tsIdx, timespan := range action.Timespans {
					require.Equal(t, expectedTimespans[tsIdx].ID, timespan.ID)
					require.Equal(t, expectedTimespans[tsIdx].StrID, timespan.StrID)
					require.Equal(t, expectedTimespans[tsIdx].Date, timespan.Date)
					require.Equal(t, expectedTimespans[tsIdx].MinuteCount, timespan.MinuteCount)
				}
			}
		}
	}

}

// Create

func (s *UserServiceSuite) TestCreateReturnsErrorFromDatabase() {

	userId := uint64(1)
	strUserId := "1"
	service := services.UserService{DB: s.DB}

	newUser := models.User{
		ID:       0,
		StrID:    "",
		Email:    "test42344@test.com",
		Forename: "test",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	expectedUser := newUser
	expectedUser.StrID = strUserId
	expectedUser.ID = userId

	authUser := models.User{
		ID:    userId,
		StrID: strUserId,
	}

	service.Create(authUser, newUser) //create it twice, so second fails on unique constraing of email
	_, isUnauth, err := service.Create(authUser, newUser)

	if err == nil {
		require.Error(s.T(), err)
	}

	require.Equal(s.T(), false, isUnauth)
}

func (s *UserServiceSuite) TestCreateCreatesUserAndReturnsWithResolvedID() {

	userId := uint64(1)
	strUserId := "1"
	service := services.UserService{DB: s.DB}

	newUser := models.User{
		Email:    "test42344@test.com",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	expectedUser := newUser
	expectedUser.StrID = strUserId
	expectedUser.ID = userId

	authUser := models.User{
		ID:    userId,
		StrID: strUserId,
	}

	result, isUnauth, err := service.Create(authUser, newUser)

	if err != nil {
		require.Error(s.T(), err)
	}

	require.Equal(s.T(), false, isUnauth)

	//Check equality
	require.Equal(s.T(), expectedUser.ID, result.ID)
	require.Equal(s.T(), expectedUser.StrID, result.StrID) // IDs should be resolved
	require.Equal(s.T(), expectedUser.Email, result.Email)
	require.Equal(s.T(), expectedUser.Forename, result.Forename)
	require.Equal(s.T(), expectedUser.Surname, result.Surname)
}
