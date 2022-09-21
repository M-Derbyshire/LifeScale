package models_test

import (
	"testing"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
)

func TestCategoryValidationChecksName(t *testing.T) {

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
		t.Run(subtest.TestName, func(t *testing.T) {

			category := models.Category{
				Name:          subtest.Name,
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			}

			err := category.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}

func TestCategoryValidationChecksColor(t *testing.T) {

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
		t.Run(subtest.TestName, func(t *testing.T) {

			category := models.Category{
				Name:          "test",
				Color:         subtest.Color,
				DesiredWeight: 1,
				Actions:       []models.Action{},
			}

			err := category.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}
