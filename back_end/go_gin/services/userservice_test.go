package services_test

import (
	"log"
	"testing"

	customtestutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_test_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"golang.org/x/crypto/bcrypt"
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

func (s *UserServiceSuite) TestGetReturnsErrorWhenUserDoesntExist() {

	//Getting a user that doesn't exist, to ensure we get an error

	service := services.UserService{DB: s.DB}

	_, err := service.Get("1", "", true)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *UserServiceSuite) TestGetReturnsUserWithRelatedScalesOnlyAndResolvedIDs() {

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
	result, err := service.Get(strUserId, "", true)

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

		require.Equal(t, 0, len(scale.Categories))
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
	result, err := service.Get(strUserId, "", false)

	if err != nil {
		require.NoError(t, err)
	}

	require.Equal(t, 0, len(result.Scales))
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
	result, err := service.Get("", user.Email, true)

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
	_, err := service.Get("", "", true)

	require.Error(t, err)
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
	service := services.UserService{DB: s.DB}

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

func (s *UserServiceSuite) TestCreateCreatesHashedPassword() {

	service := services.UserService{DB: s.DB}

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

	//Check for hashed password (compare function returns error if incorrect)
	require.Equal(s.T(), nil, bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(newUser.Password)))
}

// Update

func (s *UserServiceSuite) TestUpdatesAndReturnsWithResolvedIdAndNoPasswordNoScales() {

	t := s.T()

	service := services.UserService{DB: s.DB}

	userOriginal := models.User{
		Email:    "test1@test.com",
		Password: "test123",
		Forename: "test1",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	userUpdates := models.User{
		Email:    "test2@test.com",
		Password: "test123",
		Forename: "test3",
		Surname:  "test4",
		Scales:   []models.Scale{},
	}

	createdUser, _ := service.Create(userOriginal)
	userUpdates.ID = createdUser.ID

	result, resultErr := service.Update(userUpdates, false)
	require.NoError(t, resultErr)

	require.NotEqual(t, "", result.StrID)
	require.Equal(t, "", result.Password)
	require.Len(t, result.Scales, 0)

	//Check the returned user
	require.Equal(t, userUpdates.Email, result.Email)
	require.Equal(t, userUpdates.Forename, result.Forename)
	require.Equal(t, userUpdates.Surname, result.Surname)

	// now check the user in the DB
	dbUser, _ := service.Get(result.StrID, "", false)
	require.Equal(t, dbUser.Email, result.Email)
	require.Equal(t, dbUser.Forename, result.Forename)
	require.Equal(t, dbUser.Surname, result.Surname)

}

func (s *UserServiceSuite) TestUpdatesPasswordWhenUpdatePasswordIsTrue() {

	t := s.T()

	service := services.UserService{DB: s.DB}

	userOriginal := models.User{
		Email:    "test1@test.com",
		Password: "test123",
		Forename: "test1",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	userUpdates := models.User{
		Email:    "test1@test.com",
		Password: "test456",
		Forename: "test1",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	createdUser, _ := service.Create(userOriginal)
	userUpdates.ID = createdUser.ID

	result, resultErr := service.Update(userUpdates, true)
	require.NoError(t, resultErr)

	// now check the user in the DB
	dbUser, _ := service.Get(result.StrID, "", false)
	hashCheckErr := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(userUpdates.Password))
	require.Nil(t, hashCheckErr)
}

func (s *UserServiceSuite) TestDoesntUpdatePasswordWhenUpdatePasswordIsFalse() {

	t := s.T()

	service := services.UserService{DB: s.DB}

	userOriginal := models.User{
		Email:    "test1@test.com",
		Password: "test123",
		Forename: "test1",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	userUpdates := models.User{
		Email:    "test1@test.com",
		Password: "test456",
		Forename: "test1",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	createdUser, _ := service.Create(userOriginal)
	userUpdates.ID = createdUser.ID

	result, resultErr := service.Update(userUpdates, false)
	require.NoError(t, resultErr)

	// now check the user in the DB
	dbUser, _ := service.Get(result.StrID, "", false)
	hashCheckErr := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(userOriginal.Password)) //Still original password
	require.Nil(t, hashCheckErr)
}

func (s *UserServiceSuite) TestDoesntUpdateScales() {

	t := s.T()

	service := services.UserService{DB: s.DB}

	userOriginal := models.User{
		Email:    "test1@test.com",
		Password: "test123",
		Forename: "test1",
		Surname:  "test2",
		Scales:   []models.Scale{},
	}

	scaleOriginal := models.Scale{
		ID:              0, // Gets replaced later, when we create it in the DB
		Name:            "test1",
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories:      []models.Category{},
	}

	userUpdates := models.User{
		Email:    "test1@test.com",
		Password: "test123",
		Forename: "test1",
		Surname:  "test2",
		Scales: []models.Scale{
			{
				ID:              1,
				Name:            "test2", //name change
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			},
		},
	}

	//Add records to DB
	createdUser, _ := service.Create(userOriginal)
	userUpdates.ID = createdUser.ID
	scaleOriginal.UserID = userUpdates.ID
	scaleCreateResult := s.DB.Create(&scaleOriginal)
	require.NoError(t, scaleCreateResult.Error)

	//Attempt update
	result, resultErr := service.Update(userUpdates, false)
	require.NoError(t, resultErr)

	// now check the user in the DB
	dbUser, _ := service.Get(result.StrID, "", true)
	require.Equal(t, dbUser.Scales[0].Name, scaleOriginal.Name)
}
