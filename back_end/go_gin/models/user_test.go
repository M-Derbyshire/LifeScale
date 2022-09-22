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

type Suite struct {
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

func (s *Suite) SetupTest() {
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

func TestSuite(t *testing.T) {
	suite.Run(t, new(Suite))
}

func setupValidationDbQueryExpect(s *Suite, email string, emailCount int) {
	s.Mock.ExpectQuery(regexp.QuoteMeta("SELECT count(*) FROM `users` WHERE email = ? AND `users`.`deleted_at` IS NULL")).WithArgs(email).WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(emailCount))
}

// Validation

func (s *Suite) TestUserValidationChecksEmail() {

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

			setupValidationDbQueryExpect(s, subtest.Email, 0)

			err := user.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *Suite) TestUserValidationChecksEmailIsUnique() {

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

			setupValidationDbQueryExpect(s, subtest.NewEmail, subtest.NewEmailCount)

			err := user.Validate(authUser, *s.DB, subtest.isCreating)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *Suite) TestUserValidationChecksForename() {

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

			setupValidationDbQueryExpect(s, userEmail, 0)

			err := user.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

func (s *Suite) TestUserValidationChecksSurname() {

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

			setupValidationDbQueryExpect(s, userEmail, 0)

			err := user.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				require.NoError(t, err)
			} else if err == nil && subtest.ExpectErr {
				require.Error(t, err)
			}
		})
	}
}

// Auth validation

func (s *Suite) TestUserAuthValidationChecksUserId() {

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
