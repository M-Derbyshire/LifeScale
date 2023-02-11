package custom_utils_test

import (
	"testing"

	customutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_utils"
)

func TestIDResolverReturnsErrorIfBothValuesBlank(t *testing.T) {

	strId := ""
	numId := uint64(0)

	err := customutils.IDResolver(&numId, &strId)

	if err == nil {
		t.Error("no error was returned, when one was expected")
	}

	if strId != "" {
		t.Error("string ID was changed, when it shouldn't have been")
	}

	if numId != 0 {
		t.Error("number ID was changed, when it shouldn't have been")
	}

}

func TestIDResolverReturnsErrorIfStringIsntNumber(t *testing.T) {

	strId := "jksajdklasjd"
	numId := uint64(0)

	err := customutils.IDResolver(&numId, &strId)

	if err == nil {
		t.Error("no error was returned, when one was expected")
	}

	if strId != "jksajdklasjd" {
		t.Error("string ID was changed, when it shouldn't have been")
	}

	if numId != 0 {
		t.Error("number ID was changed, when it shouldn't have been")
	}

}

func TestIDResolverDoesNothingIfBothValuesPopulated(t *testing.T) {

	strId := "10"
	numId := uint64(10)

	err := customutils.IDResolver(&numId, &strId)

	if err != nil {
		t.Error("error was returned, when none was expected")
	}

	if strId != "10" {
		t.Error("string ID was changed, when it shouldn't have been")
	}

	if numId != 10 {
		t.Error("number ID was changed, when it shouldn't have been")
	}
}

func TestIDResolverSetsNumIDWithValueOfStrID(t *testing.T) {

	strId := "10"
	numId := uint64(0)

	err := customutils.IDResolver(&numId, &strId)

	if err != nil {
		t.Error("error was returned, when none was expected")
	}

	if numId != 10 {
		t.Error("number ID wasn't set to correct value")
	}

	if strId != "10" {
		t.Error("string ID was changed, when it shouldn't have been")
	}
}

func TestIDResolverSetsStrIDWithValueOfNumID(t *testing.T) {

	strId := ""
	numId := uint64(10)

	err := customutils.IDResolver(&numId, &strId)

	if err != nil {
		t.Error("error was returned, when none was expected")
	}

	if strId != "10" {
		t.Error("string ID wasn't set to correct value")
	}

	if numId != 10 {
		t.Error("number ID was changed, when it shouldn't have been")
	}

}
