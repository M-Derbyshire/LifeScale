package handlers_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"

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
