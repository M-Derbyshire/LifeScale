package custom_utils_test

import (
	"testing"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
)

func TestMakeEmailerReturnsEmailerWithProvidedSettingsAndIsValidTrue(t *testing.T) {

	emailFrom := "testEmail1@test.com"
	emailUsername := "testUsername1"
	emailPassword := "testPassword"
	emailHost := "test.test.com"
	emailPort := 21

	newEmailer := custom_utils.MakeEmailer(emailFrom, emailUsername, emailPassword, emailHost, emailPort)

	if !newEmailer.IsValid {
		t.Error("emailer should be valid")
	}

	if newEmailer.EmailFrom != emailFrom {
		t.Error("emailer EmailFrom was not set")
	}

	if newEmailer.EmailUsername != emailUsername {
		t.Error("emailer EmailUsername was not set")
	}

	if newEmailer.EmailPassword != emailPassword {
		t.Error("emailer EmailPassword was not set")
	}

	if newEmailer.EmailHost != emailHost {
		t.Error("emailer EmailHost was not set")
	}

	if newEmailer.EmailPort != emailPort {
		t.Error("emailer EmailPort was not set")
	}
}

func TestMakeEmailerReturnsEmailerWithIsValidFalseWhenStrSettingsEmpty(t *testing.T) {

	emailPort := 21

	// Going to test multiple times, with a blank value for one setting at a time
	for i := 0; i < 4; i++ {
		vals := make([]string, 4)
		vals[0] = "testEmail1@test.com"
		vals[1] = "testUsername1"
		vals[2] = "testPassword"
		vals[3] = "test.test.com"

		vals[i] = "" // Blank one of the values

		newEmailer := custom_utils.MakeEmailer(vals[0], vals[1], vals[2], vals[3], emailPort)
		if newEmailer.IsValid {
			t.Error("emailer should not be valid")
		}
	}
}

func TestMakeEmailerReturnsEmailerWithIsValidFalseWhenEmailPortIsZero(t *testing.T) {

	emailFrom := "testEmail1@test.com"
	emailUsername := "testUsername1"
	emailPassword := "testPassword"
	emailHost := "test.test.com"
	emailPort := 0

	newEmailer := custom_utils.MakeEmailer(emailFrom, emailUsername, emailPassword, emailHost, emailPort)

	if newEmailer.IsValid {
		t.Error("emailer should not be valid")
	}
}
