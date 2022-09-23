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

type ActionSuite struct {
	suite.Suite
	DB   *gorm.DB
	Mock sqlmock.Sqlmock
}

func (s *ActionSuite) SetupTest() {
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

func TestActionSuite(t *testing.T) {
	suite.Run(t, new(ActionSuite))
}

func setupActionAuthValidationDbQueryExpect(s *ActionSuite, actionID uint64, expectedUserId uint64) {
	selectStr := "SELECT `scales`.`user_id` FROM `actions` "
	catJoinStr := "JOIN `categories` ON `categories`.`id` = `actions`.`category_id` "
	scaleJoinStr := "JOIN `scales` ON `scales`.`id` = `categories`.`scale_id` "
	whereStr := "WHERE actions.id = ? AND `actions`.`deleted_at` IS NULL "
	extraStr := "ORDER BY `actions`.`id` LIMIT 1"

	s.Mock.ExpectQuery(regexp.QuoteMeta(selectStr + catJoinStr + scaleJoinStr + whereStr + extraStr)).WithArgs(actionID).WillReturnRows(sqlmock.NewRows([]string{"user_id"}).AddRow(expectedUserId))
}

// Validation

func (s *ActionSuite) TestActionValidationChecksName() {

	subTests := []struct {
		TestName  string
		Name      string
		ExpectErr bool
	}{
		{
			TestName:  "populated name",
			Name:      "myaction",
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

			action := models.Action{
				Name:      subtest.Name,
				Weight:    1,
				Timespans: []models.Timespan{},
			}

			err := action.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}

// Auth validation

func (s *ActionSuite) TestActionAuthValidationChecksAuthId() {

	subTests := []struct {
		TestName     string
		ActionId     uint64
		AuthUserId   uint64
		ActionUserId uint64
		ExpectErr    bool
	}{
		{
			TestName:     "Matching auth user",
			ActionId:     1,
			AuthUserId:   1,
			ActionUserId: 1,
			ExpectErr:    false,
		},
		{
			TestName:     "Different auth user",
			ActionId:     1,
			AuthUserId:   2,
			ActionUserId: 1,
			ExpectErr:    true,
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

			action := models.Action{
				ID:        subtest.ActionId,
				Name:      "test",
				Weight:    1,
				Timespans: []models.Timespan{},
			}

			setupActionAuthValidationDbQueryExpect(s, subtest.ActionId, subtest.ActionUserId)

			err := action.ValidateAuthorisation(authUser, *s.DB)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}

}

// ID Resolver

func (s *ActionSuite) TestActionIDResolveReturnsResolverErr() {

	// String ID not valid number, and blank number ID
	action := models.Action{
		ID:        0,
		StrID:     "jadasjhdkh",
		Name:      "test",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	err := action.ResolveID()

	if err == nil {
		require.Error(s.T(), err)
	}

}

func (s *ActionSuite) TestActionIDResolveSetsNumID() {

	action := models.Action{
		ID:        0,
		StrID:     "10",
		Name:      "test",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	err := action.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), uint64(10), action.ID)
}

func (s *ActionSuite) TestActionIDResolveSetsStrID() {

	action := models.Action{
		ID:        10,
		StrID:     "",
		Name:      "test",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	err := action.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), "10", action.StrID)
}

// Sanitiser

func (s *ActionSuite) TestActionSanitiseEscapesHTMLBraces() {

	action := models.Action{
		ID:        10,
		StrID:     "<h1>don't know why you'd try it here, but in case there's an attack vector</h1>",
		Name:      "<h1>test</h1>",
		Weight:    1,
		Timespans: []models.Timespan{},
	}

	expectedActionValues := struct {
		StrID string
		Name  string
	}{
		StrID: "&lt;h1&gt;don't know why you'd try it here, but in case there's an attack vector&lt;/h1&gt;",
		Name:  "&lt;h1&gt;test&lt;/h1&gt;",
	}

	action.Sanitise()

	t := s.T()
	require.Equal(t, expectedActionValues.StrID, action.StrID)
	require.Equal(t, expectedActionValues.Name, action.Name)

}
