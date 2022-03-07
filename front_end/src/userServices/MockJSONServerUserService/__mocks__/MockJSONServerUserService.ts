import TestingDummyUserService from "../../TestingDummyUserService/TestingDummyUserService";

const mockUserService = new TestingDummyUserService();
mockUserService.mockLoggedInStatus = false;

mockUserService.loginUser = (email, password) => { 
    mockUserService.mockLoggedInStatus = true;
    return new Promise((resolve, reject)=>{
        resolve({
            id: "mock-user",
            email: "mock@user.com",
            forename: "mock",
            surname: "user",
            scales: []
        });
    });
}

mockUserService.isLoggedIn = () => mockUserService.mockLoggedInStatus;

export default class { constructor() { return mockUserService; } };