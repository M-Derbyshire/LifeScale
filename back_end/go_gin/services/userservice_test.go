package services_test

import (
	"crypto/sha256"
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

// Get

func (s *UserServiceSuite) TestGetReturnsErrorFromDatabase() {

	//Getting a user that doesn't exist, to ensure we get an error

	userId := uint64(1)
	service := services.UserService{DB: s.DB}

	_, err := service.Get(userId, "", true)

	if err == nil {
		require.Error(s.T(), err)
	}
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
	result, err := service.Get(userId, "", true)

	if err != nil {
		require.NoError(t, err)
	}

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

func (s *UserServiceSuite) TestGetReturnsUserWithoutRelatedEntitiesWhenSetNotTo() {

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
				Categories:      []models.Category{},
			},
		},
	}

	createResult := s.DB.Create(&expectedUser)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(userId, "", false)

	if err != nil {
		require.NoError(t, err)
	}

	require.Equal(t, 0, len(result.Scales))
}

func (s *UserServiceSuite) TestGetWillNotIncludePassword() {

	t := s.T()
	service := services.UserService{DB: s.DB}

	user := models.User{
		ID:       1,
		StrID:    "1",
		Email:    "test42344@test.com",
		Password: "unhashedpassword",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createResult := s.DB.Create(&user)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(1, "", true)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, "", result.Password)

}

func (s *UserServiceSuite) TestGetWillAlsoRetrieveByEmail() {

	t := s.T()
	service := services.UserService{DB: s.DB}

	user := models.User{
		ID:       1,
		StrID:    "1",
		Email:    "test42344@test.com",
		Password: "unhashedpassword",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createResult := s.DB.Create(&user)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(0, user.Email, true)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, user.Email, result.Email)
}

func (s *UserServiceSuite) TestGetWillErrorIfNoIdOrEmailProvided() {

	t := s.T()
	service := services.UserService{DB: s.DB}

	user := models.User{
		ID:       1,
		StrID:    "1",
		Email:    "test42344@test.com",
		Password: "unhashedpassword",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	createResult := s.DB.Create(&user)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	_, err := service.Get(0, "", true)

	require.Error(t, err)
}

// Create

func (s *UserServiceSuite) TestCreateReturnsErrorFromDatabase() {

	userId := uint64(1)
	strUserId := "1"
	service := services.UserService{DB: s.DB, Hasher: sha256.New()}

	newUser := models.User{
		ID:       0,
		StrID:    "",
		Email:    "test42344@test.com",
		Password: "test",
		Forename: "test",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	expectedUser := newUser
	expectedUser.StrID = strUserId
	expectedUser.ID = userId

	service.Create(newUser) //create it twice, so second fails on unique constraing of email
	_, err := service.Create(newUser)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *UserServiceSuite) TestCreateCreatesUserAndReturnsWithResolvedIDAndNoPassword() {

	userId := uint64(1)
	strUserId := "1"
	service := services.UserService{DB: s.DB, Hasher: sha256.New()}

	newUser := models.User{
		Email:    "test42344@test.com",
		Password: "test",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	expectedUser := newUser
	expectedUser.StrID = strUserId
	expectedUser.ID = userId

	result, err := service.Create(newUser)

	if err != nil {
		require.Error(s.T(), err)
	}

	//Check equality
	require.Equal(s.T(), expectedUser.ID, result.ID)
	require.Equal(s.T(), expectedUser.StrID, result.StrID) // IDs should be resolved
	require.Equal(s.T(), expectedUser.Email, result.Email)
	require.Equal(s.T(), expectedUser.Forename, result.Forename)
	require.Equal(s.T(), expectedUser.Surname, result.Surname)

	require.Equal(s.T(), "", result.Password)
}

func (s *UserServiceSuite) TestCreateCreatesHashesPassword() {

	hasher := sha256.New()
	service := services.UserService{DB: s.DB, Hasher: hasher}

	newUser := models.User{
		Email:    "test42344@test.com",
		Password: "test123",
		Forename: "testaslkdaskd",
		Surname:  "testadkdkajdj",
		Scales:   []models.Scale{},
	}

	_, err := service.Create(newUser)

	if err != nil {
		require.Error(s.T(), err)
	}

	var storedHash string
	s.DB.Model(&models.User{}).Select("password").First(&storedHash)

	//Check equality
	require.Equal(s.T(), hasher.Sum([]byte(newUser.Password)), []byte(storedHash))
}
