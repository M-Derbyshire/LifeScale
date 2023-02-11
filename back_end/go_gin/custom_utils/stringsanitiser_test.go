package custom_utils_test

import (
	"testing"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
)

func TestStringSanitiserReplacesHTMLTags(t *testing.T) {

	testStr := "Hello <strong>bold</strong> World"
	expectedStr := "Hello &lt;strong&gt;bold&lt;/strong&gt; World"

	result := customutils.StringSanitiser(testStr)

	if result != expectedStr {
		t.Errorf("Expected string '%s', but instead got '%s'", expectedStr, result)
	}

}
