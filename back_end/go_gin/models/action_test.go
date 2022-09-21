package models_test

import (
	"testing"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
)

func TestActionValidationChecksName(t *testing.T) {

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
		t.Run(subtest.TestName, func(t *testing.T) {

			action := models.Action{
				Name:      subtest.Name,
				Weight:    1,
				Timespans: []models.Timespan{},
			}

			err := action.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}
