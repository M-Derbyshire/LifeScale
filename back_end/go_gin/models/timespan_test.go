package models_test

import (
	"testing"
	"time"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
)

func TestTimespanValidationChecksMinuteCount(t *testing.T) {

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
		t.Run(subtest.Name, func(t *testing.T) {

			timespan := models.Timespan{
				Date:        time.Now(),
				MinuteCount: subtest.MinuteCount,
			}

			err := timespan.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}

		})
	}
}
