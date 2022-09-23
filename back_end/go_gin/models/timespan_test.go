package models_test

import (
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type TimespanSuite struct {
	suite.Suite
	DB   *gorm.DB
	Mock sqlmock.Sqlmock
}

func (s *TimespanSuite) SetupTest() {
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

func TestTimespanSuite(t *testing.T) {
	suite.Run(t, new(TimespanSuite))
}

func setupTimespanAuthValidationDbQueryExpect(s *TimespanSuite, timespanID uint64, expectedUserId uint64) {
	s.Mock.ExpectQuery(regexp.QuoteMeta("SELECT `scales`.`user_id` FROM `timespans` JOIN `actions` ON `actions`.`id` = `timespans`.`action_id` JOIN `categories` ON `categories`.`id` = `actions`.`category_id` JOIN `scales` ON `scales`.`id` = `categories`.`scale_id` WHERE timespans.id = ? AND `timespans`.`deleted_at` IS NULL ORDER BY `timespans`.`id` LIMIT 1")).WithArgs(timespanID).WillReturnRows(sqlmock.NewRows([]string{"user_id"}).AddRow(expectedUserId))
}

// Validation
func (s *TimespanSuite) TestTimespanValidationChecksMinuteCount() {

	subTests := []struct {
		Name        string
		MinuteCount float32
		ExpectErr   bool
	}{
		{
			Name:        "valid minute count",
			MinuteCount: 9999.99,
			ExpectErr:   false,
		},
		{
			Name:        "minute count is negative",
			MinuteCount: -10.5,
			ExpectErr:   true,
		},
		{
			Name:        "minute count has more than 4 digits before the decimal",
			MinuteCount: 19999,
			ExpectErr:   true,
		},
		{
			Name:        "minute count has more than 2 digits after the decimal",
			MinuteCount: 1.111,
			ExpectErr:   true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.Name, func(t *testing.T) {

			timespan := models.Timespan{
				Date:        time.Now(),
				MinuteCount: subtest.MinuteCount,
			}

			err := timespan.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}

// Auth validation

func (s *TimespanSuite) TestTimespanAuthValidationChecksAuthId() {

	subTests := []struct {
		TestName       string
		TimespanId     uint64
		AuthUserId     uint64
		TimespanUserId uint64
		ExpectErr      bool
	}{
		{
			TestName:       "Matching auth user",
			TimespanId:     1,
			AuthUserId:     1,
			TimespanUserId: 1,
			ExpectErr:      false,
		},
		{
			TestName:       "Different auth user",
			TimespanId:     1,
			AuthUserId:     2,
			TimespanUserId: 1,
			ExpectErr:      true,
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

			timespan := models.Timespan{
				ID:          subtest.TimespanId,
				Date:        time.Now(),
				MinuteCount: 1,
			}

			setupTimespanAuthValidationDbQueryExpect(s, subtest.TimespanId, subtest.TimespanUserId)

			err := timespan.ValidateAuthorisation(authUser, *s.DB)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}

}

// ID Resolver

func (s *TimespanSuite) TestTimespanIDResolveReturnsResolverErr() {

	// String ID not valid number, and blank number ID
	timespan := models.Timespan{
		ID:          0,
		StrID:       "jadasjhdkh",
		Date:        time.Now(),
		MinuteCount: 1,
	}

	err := timespan.ResolveID()

	if err == nil {
		require.Error(s.T(), err)
	}

}

func (s *TimespanSuite) TestTimespanIDResolveSetsNumID() {

	timespan := models.Timespan{
		ID:          0,
		StrID:       "10",
		Date:        time.Now(),
		MinuteCount: 1,
	}

	err := timespan.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), uint64(10), timespan.ID)
}

func (s *TimespanSuite) TestTimespanIDResolveSetsStrID() {

	timespan := models.Timespan{
		ID:          10,
		StrID:       "",
		Date:        time.Now(),
		MinuteCount: 1,
	}

	err := timespan.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), "10", timespan.StrID)
}

// Sanitiser

func (s *TimespanSuite) TestTimespanSanitiseEscapesHTMLBraces() {

	timespan := models.Timespan{
		ID:          10,
		StrID:       "<h1>don't know why you'd try it here, but in case there's an attack vector</h1>",
		Date:        time.Now(),
		MinuteCount: 1,
	}

	expectedTimespanValues := struct {
		StrID string
	}{
		StrID: "&lt;h1&gt;don't know why you'd try it here, but in case there's an attack vector&lt;/h1&gt;",
	}

	timespan.Sanitise()

	t := s.T()
	require.Equal(t, expectedTimespanValues.StrID, timespan.StrID)

}
