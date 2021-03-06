import App from './App';
import { render, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';


process.env.REACT_APP_API_PROTOCOL = "http";
process.env.REACT_APP_API_DOMAIN = "test.com";

jest.mock('../../userServices/MockJSONServerUserService/MockJSONServerUserService', () => {
    return class { 
    
        mockLoggedInStatus;
        
        constructor()
        {
            this.mockLoggedInStatus = false;
        }
        
        loadedUser = {
            id: "mock-user",
            email: "mock@user.com",
            forename: "mock",
            surname: "user",
            scales: []
        };
        
        isLoggedIn = () => this.mockLoggedInStatus;
        
        
        loginUser = (email, password) => { 
            this.mockLoggedInStatus = true;
            return new Promise((resolve, reject)=>{
                resolve(this.loadedUser);
            });
        }
        
        getLoadedUser = () => this.loadedUser;
        
        abortRequests = ()=>{};
        
    };
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
    
    const loginPage = container.querySelector(".LoginPageLogicContainer");
    expect(loginPage).not.toBeNull();
    
});


test.each([
    ["/test1"],
    ["/test2/test2"]
])("If going to an unknown route when not logged in, App will redirect to login route", (initialRoute) => {
    
    const { container } = render(<Router initialEntries={[initialRoute]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPageLogicContainer");
    expect(loginPage).not.toBeNull();
    
});





test("App will render a LoginPageLogicContainer, when at the correct route", () => {
    
    const { container } = render(<Router initialEntries={["/login"]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPageLogicContainer");
    expect(loginPage).not.toBeNull();
    
});

test("App will direct to the home route after a succesful login from LoginPageLogicContainer", async () => {
    
    const { container } = render(<Router initialEntries={["/login"]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPageLogicContainer");
    const loginButton = within(loginPage).getByRole("button", { name: /log/i });
    
    const emailInput = container.querySelector("input[type=email]");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    const psswordInput = container.querySelector("input[type=password]");
    fireEvent.change(psswordInput, { target: { value: "test" } });
    
    fireEvent.click(loginButton);
    
    await waitFor(() => {
        const homeScreen = container.querySelector(".UserHomeScreenLogicContainer");
        expect(homeScreen).not.toBeNull();
    });
    
});

test("App will pass the registerPath prop to LoginPageLogicContainer", () => {
    
    const registerRoute = "/register";
    
    const { container } = render(<Router initialEntries={["/login"]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPageLogicContainer");
    
    const registerLink = within(loginPage).getByText(/register/i);
    
    expect(registerLink).toHaveAttribute("href", registerRoute);
    
});

test("App will pass the the forgotPaswordPath to LoginPageLogicContainer", () => {
    
    const forgotRoute = "/forgotpassword";
    
    const { container } = render(<Router initialEntries={["/login"]}>
        <App />
    </Router>);
    
    const loginPage = container.querySelector(".LoginPageLogicContainer");
    const forgotLink = within(loginPage).getByText(/forgot/i);
    
    expect(forgotLink).toHaveAttribute("href", forgotRoute);
    
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





test("App will render a UserDetailsFormLogicContainer, when at the create route", () => {
    
    const { container } = render(<Router initialEntries={["/register"]}>
        <App />
    </Router>);
    
    const userForm = container.querySelector(".UserDetailsFormLogicContainer");
    expect(userForm).not.toBeNull();
    
});

test("App will pass backButtonHandler prop to UserDetailsFormLogicContainer, at create route, which will redirect to login route", () => {
    
    const { container } = render(<Router initialEntries={["/register"]}>
        <App />
    </Router>);
    
    const userForm = container.querySelector(".UserDetailsFormLogicContainer");
    const backButton = within(userForm).getByRole("button", { name: /back/i });
    
    fireEvent.click(backButton);
    
    const loginPage = container.querySelector(".LoginPage");
    expect(loginPage).not.toBeNull();
    
});

test("App will pass isNewUser prop as true to UserDetailsFormLogicContainer, if at create route", () => {
    
    const { container } = render(<Router initialEntries={["/register"]}>
        <App />
    </Router>);
    
    const userFormHeading = container.querySelector(".UserDetailsFormLogicContainer header");
    const registerText = within(userFormHeading).queryByText(/register/i);
    
    expect(registerText).not.toBeNull();
    
});