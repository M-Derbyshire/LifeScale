package customtestutils

import (
	"errors"
	"net/http"
	"strconv"
	"testing"
)

//Run a DELETE request. If statuscode is not 200, then the returned error will be a string of the code
func DeleteEntity(t *testing.T, url string) error {
	req, reqErr := http.NewRequest(http.MethodDelete, url, nil)
	if reqErr != nil {
		return reqErr
	}

	client := &http.Client{}
	res, resErr := client.Do(req)
	if resErr != nil {
		return resErr
	}
	defer res.Body.Close()

	if res.StatusCode < 200 || res.StatusCode > 299 {
		return errors.New(strconv.Itoa(res.StatusCode))
	}

	return nil
}
