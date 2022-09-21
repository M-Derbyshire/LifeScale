package models_test

import (
	"testing"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
)

func TestUserValidationChecksEmail(t *testing.T) {

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
		t.Run(subtest.Name, func(t *testing.T) {
			user := models.User{
				Email:    subtest.Email,
				Forename: "test",
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			err := user.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}
		})
	}
}

func TestUserValidationChecksForename(t *testing.T) {

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
		t.Run(subtest.Name, func(t *testing.T) {
			user := models.User{
				Email:    "email@test.com",
				Forename: subtest.Forename,
				Surname:  "test",
				Scales:   []models.Scale{},
			}

			err := user.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}
		})
	}
}

func TestUserValidationChecksSurname(t *testing.T) {

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
		t.Run(subtest.Name, func(t *testing.T) {
			user := models.User{
				Email:    "email@test.com",
				Forename: "test",
				Surname:  subtest.Surname,
				Scales:   []models.Scale{},
			}

			err := user.Validate()

			if err != nil && !subtest.ExpectErr {
				t.Errorf("didn't expect a validation error, but recieved: %s", err.Error())
			} else if err == nil && subtest.ExpectErr {
				t.Errorf("expected a validation error, but recieved none")
			}
		})
	}
}
