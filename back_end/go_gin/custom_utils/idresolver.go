package customutils

import (
	"errors"
	"fmt"
	"strconv"
)

// IDs in the front end are strings (so this can use a NoSQL DB in the future), but we're using numeric IDs for now.
// If given a pointer to a number > 0, and an empty string, this will populate the string with the number's value.
// Given a pointer to a string ID, and a number == 0, this will populate the number with the numeris value of the string.
// This can return an error if a string can't be converted to a number, or if both values are blank (empty string, and 0)
func IDResolver(numId *uint64, strId *string) error {

	//Using 'less than 1', rather than 'equals 0', incase ID type changes in the future
	if *numId < 1 && *strId == "" {
		return errors.New("cannot resolve entity ID, as both ID values are empty")
	}

	if *numId > 0 && *strId == "" {
		*strId = strconv.FormatUint(*numId, 10)
		return nil
	}

	if *numId < 1 && *strId != "" {
		newNum, err := strconv.ParseInt(*strId, 10, 64)
		if err != nil {
			return fmt.Errorf("error while converting string ID ('%s') to numeric value: %s", *strId, err.Error())
		}

		*numId = uint64(newNum)
	}

	// If here, both values must have already been populated
	return nil
}
