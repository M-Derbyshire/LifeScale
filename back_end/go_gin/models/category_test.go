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

type CategorySuite struct {
	suite.Suite
	DB   *gorm.DB
	Mock sqlmock.Sqlmock
}

func (s *CategorySuite) SetupTest() {
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

func TestCategorySuite(t *testing.T) {
	suite.Run(t, new(CategorySuite))
}

func setupCategoryAuthValidationDbQueryExpect(s *CategorySuite, categoryID uint64, expectedUserId uint64) {
	selectStr := "SELECT `scales`.`user_id` FROM `categories` "
	scaleJoinStr := "JOIN `scales` ON `scales`.`id` = `categories`.`scale_id` "
	whereStr := "WHERE categories.id = ? AND `categories`.`deleted_at` IS NULL "
	extraStr := "ORDER BY `categories`.`id` LIMIT 1"

	s.Mock.ExpectQuery(regexp.QuoteMeta(selectStr + scaleJoinStr + whereStr + extraStr)).WithArgs(categoryID).WillReturnRows(sqlmock.NewRows([]string{"user_id"}).AddRow(expectedUserId))
}

// Validation

func (s *CategorySuite) TestCategoryValidationChecksName() {

	subTests := []struct {
		TestName  string
		Name      string
		ExpectErr bool
	}{
		{
			TestName:  "populated name",
			Name:      "mycategory",
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

			category := models.Category{
				Name:          subtest.Name,
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			}

			err := category.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}

func (s *CategorySuite) TestCategoryValidationChecksColor() {

	subTests := []struct {
		TestName  string
		Color     string
		ExpectErr bool
	}{
		{
			TestName:  "populated color",
			Color:     "red",
			ExpectErr: false,
		},
		{
			TestName:  "unpopulated color",
			Color:     "",
			ExpectErr: true,
		},
		{
			TestName:  "color contains non-alpha characters", //Color should be a color name, not a color value
			Color:     "#ff0000",
			ExpectErr: true,
		},
	}

	for _, subtest := range subTests {
		s.T().Run(subtest.TestName, func(t *testing.T) {

			category := models.Category{
				Name:          "test",
				Color:         subtest.Color,
				DesiredWeight: 1,
				Actions:       []models.Action{},
			}

			err := category.Validate(authUserExample, *s.DB, true)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}

func (s *CategorySuite) TestCategoryValidationCallsValiateOnActions() {

	t := s.T()

	category := models.Category{
		ID:            1,
		StrID:         "1",
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
		Actions: []models.Action{
			{
				ID:     1,
				StrID:  "1",
				Name:   "", //should be populated
				Weight: 1,
			},
		},
	}

	err := category.Validate(authUserExample, *s.DB, true)
	if err == nil {
		t.Errorf("expected a validation error, but recieved none")
	}

}

// Auth Validation
func (s *CategorySuite) TestCategoryAuthValidationChecksAuthId() {

	subTests := []struct {
		TestName       string
		CategoryId     uint64
		AuthUserId     uint64
		CategoryUserId uint64
		ExpectErr      bool
	}{
		{
			TestName:       "Matching auth user",
			CategoryId:     1,
			AuthUserId:     1,
			CategoryUserId: 1,
			ExpectErr:      false,
		},
		{
			TestName:       "Different auth user",
			CategoryId:     1,
			AuthUserId:     2,
			CategoryUserId: 1,
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

			category := models.Category{
				ID:            subtest.CategoryId,
				Name:          "test",
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			}

			setupCategoryAuthValidationDbQueryExpect(s, subtest.CategoryId, subtest.CategoryUserId)

			err := category.ValidateAuthorisation(authUser, *s.DB)

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}

}

// ID Resolver

func (s *CategorySuite) TestCategoryIDResolveReturnsResolverErr() {

	// String ID not valid number, and blank number ID
	category := models.Category{
		ID:            0,
		StrID:         "jadasjhdkh",
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	err := category.ResolveID()

	if err == nil {
		require.Error(s.T(), err)
	}

}

func (s *CategorySuite) TestCategoryIDResolveSetsNumID() {

	category := models.Category{
		ID:            0,
		StrID:         "10",
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	err := category.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), uint64(10), category.ID)
}

func (s *CategorySuite) TestCategoryIDResolveSetsStrID() {

	category := models.Category{
		ID:            10,
		StrID:         "",
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	err := category.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), "10", category.StrID)
}

func (s *CategorySuite) TestCategoryIDResolveCallsResolveOnActions() {

	category := models.Category{
		ID:            1,
		StrID:         "",
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
		Actions: []models.Action{
			{
				ID:     10,
				StrID:  "", //should get populated
				Name:   "test",
				Weight: 1,
			},
		},
	}

	err := category.ResolveID()

	if err != nil {
		require.NoError(s.T(), err)
	}

	require.Equal(s.T(), "10", category.Actions[0].StrID)
}

// Sanitiser

func (s *CategorySuite) TestCategorySanitiseEscapesHTMLBraces() {

	category := models.Category{
		ID:            10,
		StrID:         "<h1>don't know why you'd try it here, but in case there's an attack vector</h1>",
		Name:          "<h1>test</h1>",
		Color:         "<h2>test</h2>",
		DesiredWeight: 1,
		Actions:       []models.Action{},
	}

	expectedCategoryValues := struct {
		StrID string
		Name  string
		Color string
	}{
		StrID: "&lt;h1&gt;don't know why you'd try it here, but in case there's an attack vector&lt;/h1&gt;",
		Name:  "&lt;h1&gt;test&lt;/h1&gt;",
		Color: "&lt;h2&gt;test&lt;/h2&gt;",
	}

	category.Sanitise()

	t := s.T()
	require.Equal(t, expectedCategoryValues.StrID, category.StrID)
	require.Equal(t, expectedCategoryValues.Name, category.Name)
	require.Equal(t, expectedCategoryValues.Color, category.Color)

}

func (s *CategorySuite) TestCategorySanitiseCallsSanatiseOnActions() {

	category := models.Category{
		ID:            10,
		StrID:         "10",
		Name:          "test",
		Color:         "red",
		DesiredWeight: 1,
		Actions: []models.Action{
			{
				ID:     10,
				StrID:  "<h1>don't know why you'd try it here, but in case there's an attack vector</h1>", //should get populated
				Name:   "<h1>test</h1>",
				Weight: 1,
			},
		},
	}

	expectedActionValues := struct {
		StrID string
		Name  string
	}{
		StrID: "&lt;h1&gt;don't know why you'd try it here, but in case there's an attack vector&lt;/h1&gt;",
		Name:  "&lt;h1&gt;test&lt;/h1&gt;",
	}

	category.Sanitise()

	t := s.T()
	require.Equal(t, expectedActionValues.StrID, category.Actions[0].StrID)
	require.Equal(t, expectedActionValues.Name, category.Actions[0].Name)

}
