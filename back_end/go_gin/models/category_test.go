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
	s.Mock.ExpectQuery(regexp.QuoteMeta("SELECT `scales`.`user_id` FROM `categories` JOIN `scales` ON `scales`.`id` = `categories`.`scale_id` WHERE categories.id = ? AND `categories`.`deleted_at` IS NULL ORDER BY `categories`.`id` LIMIT 1")).WithArgs(categoryID).WillReturnRows(sqlmock.NewRows([]string{"user_id"}).AddRow(expectedUserId))
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
