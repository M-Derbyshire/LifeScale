package models_test

import (
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/stretchr/testify/suite"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type ScaleSuite struct {
	suite.Suite
	DB   *gorm.DB
	Mock sqlmock.Sqlmock
}

func (s *ScaleSuite) SetupTest() {
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
	suite.Run(t, new(ScaleSuite))
}

func setupScaleAuthValidationDbQueryExpect(s *ScaleSuite, scaleID uint64, expectedUserId uint64) {
	s.Mock.ExpectQuery(regexp.QuoteMeta("SELECT `user_id` FROM `scales` WHERE id = ? AND `scales`.`deleted_at` IS NULL")).WithArgs(scaleID).WillReturnRows(sqlmock.NewRows([]string{"user_id"}).AddRow(expectedUserId))
}

func (s *ScaleSuite) TestScaleValidationChecksName() {

	subTests := []struct {
		TestName  string
		Name      string
		ExpectErr bool
	}{
		{
			TestName:  "populated name",
			Name:      "myscale",
			ExpectErr: false,
		},
		{
			TestName:  "unpopulated name",
			Name:      "",
			ExpectErr: true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.TestName, func(t *testing.T) {

			scale := models.Scale{
				Name:            subtest.Name,
				UsesTimespans:   true,
				DisplayDayCount: 7,
				Categories:      []models.Category{},
			}

			err := scale.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}

func (s *ScaleSuite) TestScaleAuthValidationChecksAuthId() {

	subTests := []struct {
		TestName    string
		ScaleId     uint64
		AuthUserId  uint64
		ScaleUserId uint64
		ExpectErr   bool
	}{
		{
			TestName:    "Matching auth user",
			AuthUserId:  1,
			ScaleUserId: 1,
			ExpectErr:   false,
		},
		{
			TestName:    "Different auth user",
			AuthUserId:  2,
			ScaleUserId: 1,
			ExpectErr:   true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.TestName, func(t *testing.T) {

			authUser := models.User{
				ID:       subtest.AuthUserId,
				Email:    "test@test.com",
				Forename: "test",
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			scale := models.Scale{
				ID:              subtest.ScaleId,
				Name:            "test",
				UsesTimespans:   true,
				DisplayDayCount: 1,
				Categories:      []models.Category{},
			}

			setupScaleAuthValidationDbQueryExpect(s, subtest.ScaleId, subtest.ScaleUserId)

			err := scale.ValidateAuthorisation(authUser, *s.DB)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}
