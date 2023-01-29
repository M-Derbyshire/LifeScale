package models_test

import (
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type UserSuite struct {
	suite.Suite
	DB   *gorm.DB
	Mock sqlmock.Sqlmock
}

var authUserExample = models.User{
	Email:    "email@email.com",
	Forename: "test",
	Surname:  "test",
	Scales:   []models.Scale{},
}

func (s *UserSuite) SetupTest() {
	sqlMockDb, databaseMockExpectations, _ := sqlmock.New()

	var mockDialector = mysql.New(mysql.Config{
		Conn:                      sqlMockDb,
		DriverName:                "mysql",
		SkipInitializeWithVersion: true,
	})
	mockDB, _ := gorm.Open(mockDialector, &gorm.Config{})

	s.Mock = databaseMockExpectations
	s.DB = mockDB
}

func TestUserSuite(t *testing.T) {
	suite.Run(t, new(UserSuite))
}

func setupUserValidationDbQueryExpect(s *UserSuite, email string, emailCount int) {
	s.Mock.ExpectQuery(regexp.QuoteMeta("SELECT count(*) FROM `users` WHERE email = ? AND `users`.`deleted_at` IS NULL")).WithArgs(email).WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(emailCount))
}

// Validation

func (s *UserSuite) TestUserValidationChecksEmail() {

	subTests := []struct {
		Name      string
		Email     string
		ExpectErr bool
	}{
		{
			Name:      "valid email",
			Email:     "test@test.com",
			ExpectErr: false,
		},
		{
			Name:      "email without ampersand",
			Email:     "test.com",
			ExpectErr: true,
		},
		{
			Name:      "email without domain suffix",
			Email:     "test@test",
			ExpectErr: true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.Name, func(t *testing.T) {
			user := models.User{
				Email:    subtest.Email,
				Forename: "test",
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			setupUserValidationDbQueryExpect(s, subtest.Email, 0)

			err := user.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *UserSuite) TestUserValidationChecksEmailIsUnique() {

	subTests := []struct {
		Name          string
		Email         string
		NewEmail      string
		NewEmailCount int
		isCreating    bool
		ExpectErr     bool
	}{
		{
			Name:          "unique email on create",
			Email:         "",
			NewEmail:      "test@test.com",
			NewEmailCount: 0,
			isCreating:    true,
			ExpectErr:     false,
		},
		{
			Name:          "same email on update",
			Email:         "test@test.com",
			NewEmail:      "test@test.com",
			NewEmailCount: 1,
			isCreating:    false,
			ExpectErr:     false,
		},
		{
			Name:          "unique email on email change",
			Email:         "test1@test.com",
			NewEmail:      "test2@test.com",
			NewEmailCount: 0,
			isCreating:    false,
			ExpectErr:     false,
		},
		{
			Name:          "used email on create",
			Email:         "current@test.com",
			NewEmail:      "used@test.com",
			NewEmailCount: 1,
			isCreating:    true,
			ExpectErr:     true,
		},
		{
			Name:          "used email on email change",
			Email:         "current@test.com",
			NewEmail:      "used@test.com",
			NewEmailCount: 1,
			isCreating:    false,
			ExpectErr:     true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.Name, func(t *testing.T) {
			user := models.User{
				Email:    subtest.NewEmail,
				Forename: "test",
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			authUser := models.User{
				Email:    subtest.Email,
				Forename: user.Forename,
				Surname:  user.Surname,
				Scales:   user.Scales,
			}

			setupUserValidationDbQueryExpect(s, subtest.NewEmail, subtest.NewEmailCount)

			err := user.Validate(authUser, *s.DB, subtest.isCreating)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *UserSuite) TestUserValidationChecksForename() {

	subTests := []struct {
		Name      string
		Forename  string
		ExpectErr bool
	}{
		{
			Name:      "populated forename",
			Forename:  "matthew",
			ExpectErr: false,
		},
		{
			Name:      "blank forename",
			Forename:  "",
			ExpectErr: true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.Name, func(t *testing.T) {

			userEmail := "email@test.com"

			user := models.User{
				Email:    userEmail,
				Forename: subtest.Forename,
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			setupUserValidationDbQueryExpect(s, userEmail, 0)

			err := user.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *UserSuite) TestUserValidationChecksSurname() {

	subTests := []struct {
		Name      string
		Surname   string
		ExpectErr bool
	}{
		{
			Name:      "populated surname",
			Surname:   "matthew",
			ExpectErr: false,
		},
		{
			Name:      "blank surname",
			Surname:   "",
			ExpectErr: true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.Name, func(t *testing.T) {
			userEmail := "email@test.com"

			user := models.User{
				Email:    userEmail,
				Forename: "test",
				Surname:  subtest.Surname,
				Scales:   []models.Scale{},
			}

			setupUserValidationDbQueryExpect(s, userEmail, 0)

			err := user.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *UserSuite) TestUserValidationCallsValidateOnScales() {

	t := s.T()

	userEmail := "email@test.com"

	user := models.User{
		Email:    userEmail,
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				ID:              1,
				StrID:           "1",
				Name:            "", //Empty, but is required
				UsesTimespans:   true,
				DisplayDayCount: 5,
				Categories:      []models.Category{},
			},
		},
	}

	setupUserValidationDbQueryExpect(s, userEmail, 0)

	err := user.Validate(authUserExample, *s.DB, true)

	if err == nil {
		require.Error(t, err)
	}
}

// Auth validation

func (s *UserSuite) TestUserAuthValidationChecksUserId() {

	subTests := []struct {
		TestName   string
		AuthUserId uint64
		UserId     uint64
		ExpectErr  bool
	}{
		{
			TestName:   "Matching auth user",
			AuthUserId: 1,
			UserId:     1,
			ExpectErr:  false,
		},
		{
			TestName:   "Different auth user",
			AuthUserId: 2,
			UserId:     1,
			ExpectErr:  true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.TestName, func(t *testing.T) {

			user := models.User{
				ID:       subtest.UserId,
				Email:    "test@test.com",
				Forename: "test",
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			authUser := models.User{
				ID:       subtest.AuthUserId,
				Email:    "test@test.com",
				Forename: "test",
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			err := user.ValidateAuthorisation(authUser, *s.DB)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}

		})
	}
}

// ID Resolver

func (s *UserSuite) TestUserIDResolveReturnsResolverErr() {

	// String ID not valid number, and blank number ID
	user := models.User{
		ID:       0,
		StrID:    "daksjdlajs",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	err := user.ResolveID()

	if err == nil {
		require.Error(s.T(), err)
	}

}

func (s *UserSuite) TestUserIDResolveSetsNumID() {

	user := models.User{
		ID:       0,
		StrID:    "10",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	err := user.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), uint64(10), user.ID)
}

func (s *UserSuite) TestUserIDResolveSetsStrID() {

	user := models.User{
		ID:       10,
		StrID:    "",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales:   []models.Scale{},
	}

	err := user.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), "10", user.StrID)
}

func (s *UserSuite) TestUserIDResolveCallsResolveOnScales() {

	user := models.User{
		ID:       10,
		StrID:    "",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				ID:              1,
				StrID:           "",
				Name:            "test",
				UsesTimespans:   true,
				DisplayDayCount: 5,
				Categories:      []models.Category{},
			},
		},
	}

	err := user.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), "1", user.Scales[0].StrID)
}

// Sanitiser

func (s *UserSuite) TestUserSanitiseEscapesHTMLBraces() {

	user := models.User{
		ID:       10,
		StrID:    "<h1>don't know why you'd try it here, but in case there's an attack vector</h1>",
		Email:    "<h1>test</h1>@test.com",
		Forename: "<h1>test</h1>",
		Surname:  "<h2>test</h2>",
		Scales:   []models.Scale{},
	}

	expectedUserValues := struct {
		StrID    string
		Email    string
		Forename string
		Surname  string
	}{
		StrID:    "&lt;h1&gt;don't know why you'd try it here, but in case there's an attack vector&lt;/h1&gt;",
		Email:    "&lt;h1&gt;test&lt;/h1&gt;@test.com",
		Forename: "&lt;h1&gt;test&lt;/h1&gt;",
		Surname:  "&lt;h2&gt;test&lt;/h2&gt;",
	}

	user.Sanitise()

	t := s.T()
	require.Equal(t, expectedUserValues.StrID, user.StrID)
	require.Equal(t, expectedUserValues.Email, user.Email)
	require.Equal(t, expectedUserValues.Forename, user.Forename)
	require.Equal(t, expectedUserValues.Surname, user.Surname)

}

func (s *UserSuite) TestUserSanitiseCallsSanitiseOnScales() {

	user := models.User{
		ID:       10,
		StrID:    "",
		Email:    "test@test.com",
		Forename: "test",
		Surname:  "test",
		Scales: []models.Scale{
			{
				ID:              1,
				StrID:           "<h1>don't know why you'd try it here, but in case there's an attack vector</h1>",
				Name:            "<h1>test</h1>",
				UsesTimespans:   true,
				DisplayDayCount: 5,
				Categories:      []models.Category{},
			},
		},
	}

	expectedScaleValues := struct {
		StrID string
		Name  string
	}{
		StrID: "&lt;h1&gt;don't know why you'd try it here, but in case there's an attack vector&lt;/h1&gt;",
		Name:  "&lt;h1&gt;test&lt;/h1&gt;",
	}

	user.Sanitise()

	t := s.T()
	require.Equal(t, expectedScaleValues.StrID, user.Scales[0].StrID)
	require.Equal(t, expectedScaleValues.Name, user.Scales[0].Name)

}
