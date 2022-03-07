import App from './App';
import { render, fireEvent, within } from '@testing-library/react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


beforeEach(async () => {
    
    process.env.REACT_APP_API_PROTOCOL = "http";
    process.env.REACT_APP_API_DOMAIN = "test.com";
    
    const mockUserService = new TestingDummyUserService();
    mockUserService.isLoggedIn = () => false
    jest.mock('../../userServices/MockJSONServerUserService/MockJSONServerUserService', () => mockUserService);
});





test.each([
    ["/"],
    ["/user/edit"],
    ["/history"],
    ["/category/create"],
    ["/category/edit/testcatid1"],
    ["/category/edit/testcatid2"],
    ["/scale/create"],
    ["/scale/testscaleid1"],
    ["/scale/testescaleid2"],
    ["/scale/edit/testscaleid1"],
    ["/scale/edit/testescaleid2"],
])("App will redirect to login route, if the user is not logged in, and they're at a auth-only route", (initialRoute) => {
    
    const { container } = render(<Router initialEntries={[initialRoute]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPage");
    expect(loginPage).not.toBeNull();
    
});


test.each([
    ["/test1"],
    ["/test2/test2"]
])("If going to an unknown route when not logged in, App will redirect to login route", (initialRoute) => {
    
    const { container } = render(<Router initialEntries={[initialRoute]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPage");
    expect(loginPage).not.toBeNull();
    
});



test("App will render a RequestPasswordPageLogicContainer, when at the correct route", () => {
    
    const { container } = render(<Router initialEntries={["/forgotpassword"]}>
        <App />
    </Router>);
    
    const forgotPage = container.querySelector(".RequestPasswordPageLogicContainer");
    expect(forgotPage).not.toBeNull();
    
});

test("App will pass in the backButtonHandler prop for RequestPasswordPageLogicContainer, which will redirect to the login page", () => {
    
    const { container } = render(<Router initialEntries={["/forgotpassword"]}>
        <App />
    </Router>);
    
    const forgotPage = container.querySelector(".RequestPasswordPageLogicContainer");
    const backButton = within(forgotPage).getByRole("button", { name: /back/i });
    
    fireEvent.click(backButton);
    
    const loginPage = container.querySelector(".LoginPage");
    expect(loginPage).not.toBeNull();
    
});





// App will render a LoginPageLogicContainer, when at the correct route

// App will direct to the home route after a succesful login from LoginPageLogicContainer

// App will pass the registerPath prop to LoginPageLogicContainer

// App will pass the the forgotPaswordPath to LoginPageLogicContainer





// App will render a UserDetailsFormLogicContainer, when at the create route

// App will pass backButtonHandler prop to UserDetailsFormLogicContainer, at create route, which will redirect to login route

// App will pass isNewUser prop as false to UserDetailsFormLogicContainer, if at create route