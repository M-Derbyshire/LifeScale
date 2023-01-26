package handlers_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/handlers"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
)

func getUserFromBody(res *http.Response) (models.User, error) {
	resData, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		return models.User{}, readErr
	}

	var resBody models.User
	jsonErr := json.Unmarshal(resData, &resBody)
	return resBody, jsonErr
}

func getJwtOutputFromBody(res *http.Response) (handlers.JwtOutput, error) {
	resData, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		return handlers.JwtOutput{}, readErr
	}

	var resBody handlers.JwtOutput
	jsonErr := json.Unmarshal(resData, &resBody)
	return resBody, jsonErr
}

func getErrorMessageFromBody(res *http.Response) (string, error) {
	resData, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		return "", readErr
	}

	resBody := struct {
		Error string `json:"error"`
	}{}
	jsonErr := json.Unmarshal(resData, &resBody)
	return resBody.Error, jsonErr
}

func postUser(newUser models.User, testServer *httptest.Server) (*http.Response, error) {
	reqJson, _ := json.Marshal(newUser)
	reqBody := bytes.NewBuffer(reqJson)
	return http.Post(fmt.Sprintf("%s/", testServer.URL), "application/json", reqBody)
}

func putUser(newUser models.User, testServer *httptest.Server) (*http.Response, error) {
	client := &http.Client{}
	reqJson, _ := json.Marshal(newUser)
	reqBody := bytes.NewBuffer(reqJson)
	req, _ := http.NewRequest("PUT", fmt.Sprintf("%s/", testServer.URL), reqBody)

	return client.Do(req)
}

func postPasswordChange(passwordChange models.PasswordChange, testServer *httptest.Server) (*http.Response, error) {
	reqJson, _ := json.Marshal(passwordChange)
	reqBody := bytes.NewBuffer(reqJson)
	return http.Post(fmt.Sprintf("%s/", testServer.URL), "application/json", reqBody)
}

func postTokenRefresh(token string, testServer *httptest.Server) (*http.Response, error) {
	client := &http.Client{}

	reqBody := bytes.NewBuffer([]byte("{}"))
	req, _ := http.NewRequest("POST", fmt.Sprintf("%s/", testServer.URL), reqBody)
	req.Header.Add("Authorization", "Bearer "+token)

	return client.Do(req)
}

func getRequestWithAuthHeader(authHeader string, url string) (*http.Response, error) {
	client := &http.Client{}

	reqBody := bytes.NewBuffer([]byte(""))
	req, _ := http.NewRequest("GET", url, reqBody)
	req.Header.Add("Authorization", authHeader)

	return client.Do(req)
}

// timespan --------------------------------------------

func handleTimespanResponse(res *http.Response) (models.Timespan, error) {
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return models.Timespan{}, errors.New(strconv.Itoa(res.StatusCode))
	}

	resBodyBytes, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		return models.Timespan{}, readErr
	}

	var result models.Timespan
	jsonErr := json.Unmarshal(resBodyBytes, &result)
	if jsonErr != nil {
		return models.Timespan{}, jsonErr
	}

	return result, nil
}

//Run a timespan POST request. If statuscode is not 200, then the returned error will be a string of the code
func postTimespan(t *testing.T, url string, timespan models.Timespan) (models.Timespan, error) {
	reqJson, _ := json.Marshal(timespan)
	reqBody := bytes.NewBuffer(reqJson)
	res, reqErr := http.Post(url, "application/json", reqBody)

	if reqErr != nil {
		return models.Timespan{}, reqErr
	}
	defer res.Body.Close()

	return handleTimespanResponse(res)
}

// action --------------------------------------------

func handleActionResponse(res *http.Response) (models.Action, error) {
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return models.Action{}, errors.New(strconv.Itoa(res.StatusCode))
	}

	resBodyBytes, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		return models.Action{}, readErr
	}

	var result models.Action
	jsonErr := json.Unmarshal(resBodyBytes, &result)
	if jsonErr != nil {
		return models.Action{}, jsonErr
	}

	return result, nil
}

//Run an action POST request. If statuscode is not 200, then the returned error will be a string of the code
func postAction(t *testing.T, url string, action models.Action) (models.Action, error) {
	reqJson, _ := json.Marshal(action)
	reqBody := bytes.NewBuffer(reqJson)
	res, reqErr := http.Post(url, "application/json", reqBody)

	if reqErr != nil {
		return models.Action{}, reqErr
	}
	defer res.Body.Close()

	return handleActionResponse(res)
}

//Run an action PUT request. If statuscode is not 200, then the returned error will be a string of the code
func putAction(t *testing.T, url string, actionData models.Action) (models.Action, error) {
	reqJson, _ := json.Marshal(actionData)
	req, reqErr := http.NewRequest(http.MethodPut, url, bytes.NewReader(reqJson))
	if reqErr != nil {
		return models.Action{}, reqErr
	}

	client := &http.Client{}
	res, resErr := client.Do(req)
	if resErr != nil {
		return models.Action{}, resErr
	}
	defer res.Body.Close()

	return handleActionResponse(res)
}

// category --------------------------------------------

func handleCategoryResponse(res *http.Response) (models.Category, error) {
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return models.Category{}, errors.New(strconv.Itoa(res.StatusCode))
	}

	resBodyBytes, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		return models.Category{}, readErr
	}

	var result models.Category
	jsonErr := json.Unmarshal(resBodyBytes, &result)
	if jsonErr != nil {
		return models.Category{}, jsonErr
	}

	return result, nil
}

//Run a category POST request. If statuscode is not 200, then the returned error will be a string of the code
func postCategory(t *testing.T, url string, category models.Category) (models.Category, error) {
	reqJson, _ := json.Marshal(category)
	reqBody := bytes.NewBuffer(reqJson)
	res, reqErr := http.Post(url, "application/json", reqBody)

	if reqErr != nil {
		return models.Category{}, reqErr
	}
	defer res.Body.Close()

	return handleCategoryResponse(res)
}

//Run a category PUT request. If statuscode is not 200, then the returned error will be a string of the code
func putCategory(t *testing.T, url string, categoryData models.Category) (models.Category, error) {
	reqJson, _ := json.Marshal(categoryData)
	req, reqErr := http.NewRequest(http.MethodPut, url, bytes.NewReader(reqJson))
	if reqErr != nil {
		return models.Category{}, reqErr
	}

	client := &http.Client{}
	res, resErr := client.Do(req)
	if resErr != nil {
		return models.Category{}, resErr
	}
	defer res.Body.Close()

	return handleCategoryResponse(res)
}

// scale --------------------------------------------

func handleScaleResponse(res *http.Response) (models.Scale, error) {
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return models.Scale{}, errors.New(strconv.Itoa(res.StatusCode))
	}

	resBodyBytes, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		return models.Scale{}, readErr
	}

	var result models.Scale
	jsonErr := json.Unmarshal(resBodyBytes, &result)
	if jsonErr != nil {
		return models.Scale{}, jsonErr
	}

	return result, nil
}

//Get a scale model from the GET endpoint. If statuscode is not 200, then the returned error will be a string of the code
func getScale(t *testing.T, url string) (models.Scale, error) {
	res, reqErr := http.Get(url)
	if reqErr != nil {
		return models.Scale{}, reqErr
	}
	defer res.Body.Close()

	return handleScaleResponse(res)
}

//Run a scale POST request. If statuscode is not 200, then the returned error will be a string of the code
func postScale(t *testing.T, url string, scale models.Scale) (models.Scale, error) {
	reqJson, _ := json.Marshal(scale)
	reqBody := bytes.NewBuffer(reqJson)
	res, reqErr := http.Post(url, "application/json", reqBody)

	if reqErr != nil {
		return models.Scale{}, reqErr
	}
	defer res.Body.Close()

	return handleScaleResponse(res)
}

//Run a scale PUT request. If statuscode is not 200, then the returned error will be a string of the code
func putScale(t *testing.T, url string, scaleData models.Scale) (models.Scale, error) {
	reqJson, _ := json.Marshal(scaleData)
	req, reqErr := http.NewRequest(http.MethodPut, url, bytes.NewReader(reqJson))
	if reqErr != nil {
		return models.Scale{}, reqErr
	}

	client := &http.Client{}
	res, resErr := client.Do(req)
	if resErr != nil {
		return models.Scale{}, resErr
	}
	defer res.Body.Close()

	return handleScaleResponse(res)
}
