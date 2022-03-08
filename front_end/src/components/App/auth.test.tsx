import App from './App';
import { render, fireEvent, within, waitFor, screen, wait } from '@testing-library/react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import IScale from '../../interfaces/IScale';
import ICategory from '../../interfaces/ICategory';


process.env.REACT_APP_API_PROTOCOL = "http";
process.env.REACT_APP_API_DOMAIN = "test.com";

jest.mock('../../userServices/MockJSONServerUserService/MockJSONServerUserService', () => {
    return class { 
    
        mockLoggedInStatus;
        
        constructor()
        {
            this.mockLoggedInStatus = true;
        }
        
        loadedUser = {
            id: "mock-user",
            email: "mock@user.com",
            forename: "mock",
            surname: "user",
            scales: [
                {
                    id: "testscale1",
                    name: "testScale1",
                    usesTimespans: true,
                    displayDayCount: 1,
                    categories: [
                        {
                            id: "testcategory1",
                            name: "testCategory1",
                            color: "red",
                            desiredWeight: 1,
                            actions: []
                        },
                        {
                            id: "testcategory2",
                            name: "testCategory2",
                            color: "red",
                            desiredWeight: 1,
                            actions: []
                        }
                    ]
                },
                {
                    id: "testscale2",
                    name: "testScale2",
                    usesTimespans: true,
                    displayDayCount: 1,
                    categories: [
                        {
                            id: "testcategory3",
                            name: "testCategory3",
                            color: "red",
                            desiredWeight: 1,
                            actions: []
                        },
                        {
                            id: "testcategory4",
                            name: "testCategory4",
                            color: "red",
                            desiredWeight: 1,
                            actions: []
                        },
                        {
                            id: "testcategory5",
                            name: "testCategory5",
                            color: "red",
                            desiredWeight: 1,
                            actions: []
                        }
                    ]
                }
            ]
        };
        
        getLoadedUser = () => this.loadedUser;
        
        isLoggedIn = () => this.mockLoggedInStatus;
        
        abortRequests = () => {};
        
        getScale = (id:string) => this.loadedUser.scales.filter(scale => scale.id === id)[0];
        
        getCategory = (catID:string, scaleID:string) => 
            this.loadedUser.scales.filter(scale => scale.id === scaleID)![0].categories.filter(cat => cat.id === catID)[0];
        
        deleteCategory = (scale:IScale, category:ICategory) => new Promise((resolve, reject) => resolve([]));
        
        deleteScale = (scale:IScale) => new Promise((resolve, reject) => resolve([]));
        
        logoutUser = () => {
            this.mockLoggedInStatus = false;
            return new Promise((resolve, reject) => resolve(null));
        }
        
    };
});






test.each([
    ["/login"],
    ["/forgotpassword"],
    ["/register"]
])("App will redirect to home route if the user is logged in, and they're at a non-auth route", (initialRoute) => {
    
    const { container } = render(<Router initialEntries={[initialRoute]}>
        <App />
    </Router>);
    
    const homePage = container.querySelector(".UserHomeScreenLogicContainer");
    expect(homePage).not.toBeNull();
    
});

test.each([
    ["/test1"],
    ["/test2/test2"]
])("If going to an unknown route when logged in, App will redirect to home route", (initialRoute) => {
    
    const { container } = render(<Router initialEntries={[initialRoute]}>
        <App />
    </Router>);
    
    const homePage = container.querySelector(".UserHomeScreenLogicContainer");
    expect(homePage).not.toBeNull();
    
});



test("App will render a UserDetailsFormLogicContainer, when at the edit user route", () => {
    
    const { container } = render(<Router initialEntries={["/user/edit"]}>
        <App />
    </Router>);
    
    const userForm = container.querySelector(".UserDetailsFormLogicContainer");
    expect(userForm).not.toBeNull();
    
});

test("App will pass backButtonHandler prop to UserDetailsFormLogicContainer, at edit route, which will redirect to home route", () => {
    
    const { container } = render(<Router initialEntries={["/user/edit"]}>
        <App />
    </Router>);
    
    const userForm = container.querySelector(".UserDetailsFormLogicContainer");
    const backButton = within(userForm).getByRole("button", { name: /back/i });
    
    fireEvent.click(backButton);
    
    const homePage = container.querySelector(".UserHomeScreenLogicContainer");
    expect(homePage).not.toBeNull();
    
});

test("App will pass isNewUser prop as false to UserDetailsFormLogicContainer, if at edit route", () => {
    
    const { container } = render(<Router initialEntries={["/user/edit"]}>
        <App />
    </Router>);
    
    const userFormHeading = container.querySelector(".UserDetailsFormLogicContainer header");
    const registerText = within(userFormHeading).queryByText(/register/i);
    
    expect(registerText).toBeNull();
    
});






test("App will render a AmendActionHistoryPageLogicContainer, when at the correct route", () => {
    
    const { container } = render(<Router initialEntries={["/scale/history/testscale1"]}>
        <App />
    </Router>);
    
    const historyPage = container.querySelector(".AmendActionHistoryPageLogicContainer");
    expect(historyPage).not.toBeNull();
    
});

test.each([
    ["testscale1", "testScale1"],
    ["testscale2", "testScale2"]
])("App will pass the scaleID prop to AmendActionHistoryPageLogicContainer", (scaleID, scaleName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com/scale/history/${scaleID}`);
    
    const { container } = render(<Router initialEntries={[`/scale/history/${scaleID}`]}>
        <App />
    </Router>);
    
    const historyPageHeader = container.querySelector(".AmendActionHistoryPageLogicContainer header");
    expect(historyPageHeader.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test("App will pass the backButtonHandler prop to AmendActionHistoryPageLogicContainer, which will redirect to home route", () => {
    
    const { container } = render(<Router initialEntries={["/scale/history/testscale1"]}>
        <App />
    </Router>);
    
    const historyPage = container.querySelector(".AmendActionHistoryPageLogicContainer");
    const backButton = within(historyPage).getByRole("button", { name: /back/i });
    
    fireEvent.click(backButton);
    
    const homePage = container.querySelector(".UserHomeScreenLogicContainer");
    expect(homePage).not.toBeNull();
    
});







test.each([
    ["/scale/create"],
    ["/scale/edit/testscale1"],
    ["/scale/edit/testscale2"]
])("App will render a ScaleDetailsFormLogicContainer, when at the correct routes", (route) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const scalePage = container.querySelector(".ScaleDetailsFormLogicContainer");
    expect(scalePage).not.toBeNull();
    
});

test.each([
    ["/scale/create"],
    ["/scale/edit/testscale1"],
    ["/scale/edit/testscale2"]
])("App will pass backButtonHandler prop to ScaleDetailsFormLogicContainer, at correct routes, which will redirect back to home route", (route) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const scalePage = container.querySelector(".ScaleDetailsFormLogicContainer");
    const backButton = within(scalePage).getByRole("button", { name: /back/i });
    
    fireEvent.click(backButton);
    
    const homePage = container.querySelector(".UserHomeScreenLogicContainer");
    expect(homePage).not.toBeNull();
    
});

test("App will not pass scaleID prop to ScaleDetailsFormLogicContainer, if at create route", () => {
    
    const route = "/scale/create";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const scalePageHeader = container.querySelector(".ScaleDetailsFormLogicContainer header");
    
    expect(scalePageHeader.textContent.toLowerCase()).toEqual(expect.stringContaining("create"));
    
});


test.each([
    ["/scale/edit/testscale1", "testScale1"],
    ["/scale/edit/testscale2", "testScale2"]
])("App will pass scaleID prop to ScaleDetailsFormLogicContainer, if at edit route", (route, scaleName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const scalePageHeader = container.querySelector(".ScaleDetailsFormLogicContainer header");
    
    expect(scalePageHeader.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test("App will not pass onSuccessfulDeleteHandler prop to ScaleDetailsFormLogicContainer, if at create route", () => {
    
    const route = "/scale/create";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const scalePage = container.querySelector(".ScaleDetailsFormLogicContainer");
    const deleteButton = within(scalePage).queryByRole("button", { name: /delete/i });
    
    expect(deleteButton).toBeNull();
    
});

test("App will pass onSuccessfulDeleteHandler prop to ScaleDetailsFormLogicContainer, if at edit route, which will redirect to home route", async () => {
    
    const route = "/scale/edit/testscale1";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const scalePage = container.querySelector(".ScaleDetailsFormLogicContainer");
    const deleteButton = within(scalePage).queryByRole("button", { name: /delete/i });
    
    fireEvent.click(deleteButton)
    
    await waitFor(() => expect(container.querySelector(".UserHomeScreenLogicContainer")).not.toBeNull());
    
});

test("App will pass editCategoryHandler prop to ScaleDetailsFormLogicContainer, if at edit route, and take you to the correct category route when triggered", () => {
    
    const route = "/scale/edit/testscale1";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    //Bit more coupled than I'd like, but wanted specificity
    const categoryName = "testCategory1";
    const cardDisplay = container.querySelector(".ScaleDetailsFormLogicContainer .CardDisplay");
    const editCardForCategory = within(cardDisplay).queryByText(categoryName)?.closest("div");
    const editButton = within(editCardForCategory).queryByRole("button", { name: /edit/i });
    
    // This line won't affect routing, just the pathname that the IDs are pulled from
    window.location = new URL(`https://www.test.com/category/edit/testscale1/testcategory1`);
    
    fireEvent.click(editButton);
    
    
    const categoryPageHeader = container.querySelector(".CategoryDetailsFormLogicContainer header");
    
    expect(categoryPageHeader?.textContent).toEqual(expect.stringContaining(categoryName));
    
});

test("App will pass addCategoryHandler prop to ScaleDetailsFormLogicContainer, if at edit route, and take you to the new category route when triggered", () => {
    
    const route = "/scale/edit/testscale2";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    //Way more coupled than I'd like, but no way around it
    const addItemCard = container.querySelector(".AddItemCard");
    
    
    // This line won't affect routing, just the pathname that the IDs are pulled from
    window.location = new URL(`https://www.test.com/category/create/testscale2`);
    
    fireEvent.click(addItemCard);
    
    
    const categoryPageHeader = container.querySelector(".CategoryDetailsFormLogicContainer header");
    expect(categoryPageHeader?.textContent?.toLowerCase()).toEqual(expect.stringContaining("create"));
    
});








test.each([
    ["/category/create/testscale1"],
    ["/category/edit/testscale1/testcategory1"],
    ["/category/edit/testscale2/testcategory3"]
])("App will render a CategoryDetailsFormLogicContainer, when at the correct routes", (route) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const categoryPage = container.querySelector(".CategoryDetailsFormLogicContainer");
    expect(categoryPage).not.toBeNull();
    
});

test.each([
    ["/category/create/testscale1", "testScale1"],
    ["/category/edit/testscale1/testcategory1", "testScale1"],
    ["/category/edit/testscale2/testcategory3", "testScale2"]
])("App will pass backButtonHandler prop to CategoryDetailsFormLogicContainer, at correct routes, which will redirect to the scale", (route, scaleName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const categoryPage = container.querySelector(".CategoryDetailsFormLogicContainer");
    const backButton = within(categoryPage).getByRole("button", { name: /back/i });
    
    fireEvent.click(backButton);
    
    const scalePageHeader = container.querySelector(".ScaleDetailsFormLogicContainer header");
    expect(scalePageHeader).not.toBeNull();
    expect(scalePageHeader.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test.each([
    ["/category/edit/testscale1/testcategory1", "testCategory1"],
    ["/category/edit/testscale1/testcategory2", "testCategory2"],
    ["/category/edit/testscale2/testcategory3", "testCategory3"],
    ["/category/edit/testscale2/testcategory4", "testCategory4"],
])("App will pass scaleID and categoryID props to CategoryDetailsFormLogicContainer, at correct edit routes", (route, expectedName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const categoryPageHeader = container.querySelector(".CategoryDetailsFormLogicContainer header");
    
    expect(categoryPageHeader.textContent).toEqual(expect.stringContaining(expectedName));
    
});

test("App will not pass categoryID prop to CategoryDetailsFormLogicContainer, if at create route", () => {
    
    const route = "/category/create/testscale1";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const categoryPageHeader = container.querySelector(".CategoryDetailsFormLogicContainer header");
    
    expect(categoryPageHeader.textContent.toLowerCase()).toEqual(expect.stringContaining("create"));
    expect(categoryPageHeader.textContent.toLocaleLowerCase()).not.toEqual(expect.stringContaining("test"));
    
});

test("App will not pass onSuccessfulDeleteHandler prop to CategoryDetailsFormLogicContainer, if at create route", () => {
    
    const route = "/category/create/testscale1";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const categoryPage = container.querySelector(".CategoryDetailsFormLogicContainer");
    const deleteButton = within(categoryPage).queryByRole("button", { name: /delete/i });
    
    expect(deleteButton).toBeNull();
    
});

test("App will pass onSuccessfulDeleteHandler prop to CategoryDetailsFormLogicContainer, if at edit route, and take you back to the scale when triggered", async () => {
    
    const route = "/category/edit/testscale1/testcategory1";
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const categoryPage = container.querySelector(".CategoryDetailsFormLogicContainer");
    const deleteButton = within(categoryPage).getByRole("button", { name: /delete/i });
    
    fireEvent.click(deleteButton)
    
    await waitFor(() => expect(container.querySelector(".ScaleDetailsFormLogicContainer")).not.toBeNull());
    
});








test.each([
    ["/", "testScale1"],
    ["/scale/testscale1", "testScale1"],
    ["/scale/testscale2", "testScale2"]
])("App will render UserHomeScreenLogicContainer, when at the correct routes, and pass in the selected scale ID if one in the URL", (route, scaleName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const homePageHeader = container.querySelector(".UserHomeScreenLogicContainer header");
    expect(homePageHeader?.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test("App will set selectedScaleID on UserHomeScreenLogicContainer to undefined, if at home route", () => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com`);
    
    const { container } = render(<Router initialEntries={["/"]}>
        <App />
    </Router>);
    
    const homePageHeader = container.querySelector(".UserHomeScreenLogicContainer header");
    expect(homePageHeader?.textContent).toEqual(expect.stringContaining("testScale1"));
    
});

test.each([
    ["/"],
    ["/scale/testscale1"]
])("App will pass correct scaleURLBase prop into UserHomeScreenLogicContainer", (route) => {
    
    const { container } = render(<Router initialEntries={["/"]}>
        <App />
    </Router>);
    
    const scaleLink = container.querySelector("a[href='/scale/testscale1']");
    
    expect(scaleLink).not.toBeNull();
    
});

test.each([
    ["/"],
    ["/scale/testscale1"]
])("App will pass editUserUrl prop into UserHomeScreenLogicContainer", (route) => {
    
    const { container } = render(<Router initialEntries={["/"]}>
        <App />
    </Router>);
    
    const editUserLink = container.querySelector("a[href='/user/edit']");
    
    expect(editUserLink).not.toBeNull();
    
});

test.each([
    ["/"],
    ["/scale/testscale1"]
])("App will pass createScaleUrl prop into UserHomeScreenLogicContainer", (route) => {
    
    const { container } = render(<Router initialEntries={["/"]}>
        <App />
    </Router>);
    
    const createScaleLink = container.querySelector("a[href='/scale/create']");
    
    expect(createScaleLink).not.toBeNull();
    
});

test.each([
    ["/"],
    ["/scale/testscale1"]
])("App will redirect to the login page route, after a successful logout", async (route) => {
    
    const { container } = render(<Router initialEntries={[route]}>
        <App />
    </Router>);
    
    const navArea = container.querySelector("nav");
    const logout = within(navArea).getByText(/logout/i);
    
    fireEvent.click(logout);
    
    await waitFor(() => {
        const loginPage = container.querySelector(".LoginPageLogicContainer");
        expect(loginPage).not.toBeNull(); 
    });
    
});

test.each([
    ["/", "testscale1", "testScale1"],
    ["/scale/testscale2", "testscale2", "testScale2"]
])("App will pass the editScaleCallback to UserHomeScreenLogicContainer, which will take you to the edit route for the scale ID that the callback was called with", (route, scaleID, scaleName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={["/"]}>
        <App />
    </Router>);
    
    const editScaleButton = screen.getByRole("button", { name: /edit scale/i });
    
    window.location = new URL(`https://www.test.com/scale/edit/${scaleID}`); //Won't affect routing, just the params in the URL
    
    fireEvent.click(editScaleButton);
    
    const scaleFormHeader = container.querySelector(".ScaleDetailsFormLogicContainer header");
    expect(scaleFormHeader?.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test.each([
    ["/", "testscale1", "testScale1"],
    ["/scale/testscale2", "testscale2", "testScale2"]
])("App will pass the amendHistoryCallback prop to UserHomeScreenLogicContainer, which will take you to the amend action history route for the scale ID that the callback was called with", (route, scaleID, scaleName) => {
    
    delete window.location;
    window.location = new URL(`https://www.test.com${route}`);
    
    const { container } = render(<Router initialEntries={["/"]}>
        <App />
    </Router>);
    
    const amendButton = screen.getByRole("button", { name: /amend/i });
    
    window.location = new URL(`https://www.test.com/scale/history/${scaleID}`); //Won't affect routing, just the params in the URL
    
    fireEvent.click(amendButton);
    
    const amendPageHeader = container.querySelector(".AmendActionHistoryPageLogicContainer header");
    expect(amendPageHeader?.textContent).toEqual(expect.stringContaining(scaleName));
    
});