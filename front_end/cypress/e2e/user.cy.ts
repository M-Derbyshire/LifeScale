/// <reference types="../support" />

import IUser from "../../src/interfaces/IUser";


describe("User functionality", () => {
    
    const loginRoute = "/login";
    const registerRoute = "/register";
    
    let userTestUsersFixture:(Omit<IUser, "id"> & { password:string })[];
    const userForRegistration = {
        email: "new@test.com",
        password: "test",
        forename: "test",
        surname: "testing",
        scales: []
    };
    const userForEmailChange = { //When changing to a valid email address. Needed so we can still delete it after all have run
        email: "newemail@test.com",
        password: "test",
        forename: "test",
        surname: "testing",
        scales: []
    }
    
    
    beforeEach(() => {
        //Load the data used for the tests
        cy.fixture("user-test-users").then((userTestUsers) => {
            userTestUsersFixture = userTestUsers;
            cy.setupUsersData(userTestUsers);
        });
    });
    
    after(() => {
        cy.deleteGivenUsers([...userTestUsersFixture, userForRegistration, userForEmailChange]);
    });
    
    
    //Should put yoyr test code in .then() of result
    const navToEditRoute = (user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user).then(() => {
            return cy.get('[data-test="editUserNavLink"]').click(); //using visit can make the app think we're logged out
        });
    };
    
    
    
    // -- Registration ---------------------------------------------------------
    
    
    it("can't register user with blank data", () => {
        cy.visit(registerRoute);
        
        cy.get('[data-test="userDetailsSaveBtn"]').click();
        
        cy.get('[data-test="userDetailsEmail"]:invalid');
        cy.get('[data-test="userDetailsForename"]:invalid');
        cy.get('[data-test="userDetailsSurname"]:invalid');
    });
      
    
    it("can't register user with invalid email address", () => {
        cy.visit(registerRoute);
        
        cy.get('[data-test="userDetailsEmail"]').type("notvalidemailaddress");
        cy.get('[data-test="userDetailsForename"]').type(userForRegistration.forename);
        cy.get('[data-test="userDetailsSurname"]').type(userForRegistration.surname);
        cy.get('[data-test="passwordInput"]').type(userForRegistration.password);
        cy.get('[data-test="confirmPasswordInput"]').type(userForRegistration.password);
        
        cy.get('[data-test="userDetailsSaveBtn"]').click();
        
        cy.get('[data-test="userDetailsEmail"]:invalid');
    });
    
    
    it("can't register user with existing email address", () => {
        cy.visit(registerRoute);
        
        cy.get('[data-test="userDetailsEmail"]').type(userTestUsersFixture[0].email!);
        cy.get('[data-test="userDetailsForename"]').type(userForRegistration.forename);
        cy.get('[data-test="userDetailsSurname"]').type(userForRegistration.surname);
        cy.get('[data-test="passwordInput"]').type(userForRegistration.password);
        cy.get('[data-test="confirmPasswordInput"]').type(userForRegistration.password);
        
        cy.get('[data-test="userDetailsSaveBtn"]').click();
        
        cy.get('[data-savemessagetype="badSaveMessage"]');
    });
    
    
    it("can't register with confirmation password not matching password", () => {
        cy.visit(registerRoute);
        
        cy.get('[data-test="userDetailsEmail"]').type(userForRegistration.email);
        cy.get('[data-test="userDetailsForename"]').type(userForRegistration.forename);
        cy.get('[data-test="userDetailsSurname"]').type(userForRegistration.surname);
        cy.get('[data-test="passwordInput"]').type("password123!");
        cy.get('[data-test="confirmPasswordInput"]').type("passwordnotamatch");
        
        cy.get('[data-test="userDetailsSaveBtn"]').click();
        
        //There may be a message in the PasswordFormPartial, so we don't want to select that one
        cy.get('[data-savemessagetype="badSaveMessage"]:not(.PasswordFormPartial [data-savemessagetype="badSaveMessage"])');
    });
    
    
    it("can register with valid data", () => {
        cy.visit(registerRoute);
        
        cy.get('[data-test="userDetailsEmail"]').type(userForRegistration.email);
        cy.get('[data-test="userDetailsForename"]').type(userForRegistration.forename);
        cy.get('[data-test="userDetailsSurname"]').type(userForRegistration.surname);
        cy.get('[data-test="passwordInput"]').type(userForRegistration.password);
        cy.get('[data-test="confirmPasswordInput"]').type(userForRegistration.password);
        
        cy.get('[data-test="userDetailsSaveBtn"]').click();
        
        cy.get('[data-savemessagetype="goodSaveMessage"]');
        
        //Password form should be removed
        cy.get('[data-test="passwordInput"]').should("not.exist");
        cy.get('[data-test="confirmPasswordInput"]').should("not.exist");
    });
    
    
    
    it("can use the back button on register, to go back to login", () => {
        cy.visit(registerRoute);
        
        cy.get('[data-test="userDetailsBackButton"]').click();
        
        cy.url().should("include", loginRoute);
    });
    
    
    
    
    // -- Editing ---------------------------------------------------------
    
    it("can navigate to edit user route", () => {
        
        cy.loginUser(userTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="editUserNavLink"]').click();
            cy.url().should("include", "/user/edit");
            cy.get('[data-test="userDetailsEmail"]');
            
        });
        
    });
    
    
    it("can't save edit with blank data", () => {
        
        const user = userTestUsersFixture[0];
        
        navToEditRoute(user).then(() => {
            
            cy.get('[data-test="userDetailsEmail"]').invoke("val", "");
            cy.get('[data-test="userDetailsForename"]').invoke("val", "");
            cy.get('[data-test="userDetailsSurname"]').invoke("val", "");
            
            cy.get('[data-test="userDetailsSaveBtn"]').click();
            
            cy.get('[data-test="userDetailsEmail"]:invalid');
            cy.get('[data-test="userDetailsForename"]:invalid');
            cy.get('[data-test="userDetailsSurname"]:invalid');
        });
        
    });
    
    
    it("can't save edit if invalid email address", () => {
        
        navToEditRoute(userTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="userDetailsEmail"]').invoke("val", "notvalidemailaddress");
            cy.get('[data-test="userDetailsSaveBtn"]').click();
            
            cy.get('[data-test="userDetailsEmail"]:invalid');
            
        });
        
    });
    
    
    it("can't save edit if changed email address is already in use", () => {
        
        const user = userTestUsersFixture[0];
        const otherUser = userTestUsersFixture[1];
        
        navToEditRoute(user).then(() => {
            
            //Not sure why, but just setting it to the new email value with invoke doesn't seem to change it (it looks like it has, but then saves as 
            //the original value)
            cy.get('[data-test="userDetailsEmail"]').invoke("val", "").type(otherUser.email);
            cy.get('[data-test="userDetailsSaveBtn"]').click();
            
            cy.get('[data-savemessagetype="badSaveMessage"]');
        });
        
    });
    
    it("can save edit to user, with same email address", () => {
        
        navToEditRoute(userTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="userDetailsForename"]').invoke("val", "").type("newName");
            cy.get('[data-test="userDetailsSurname"]').invoke("val", "").type("newSurname");
            
            cy.get('[data-test="userDetailsSaveBtn"]').click();
            
            cy.get('[data-savemessagetype="goodSaveMessage"]');
        });
        
    });
    
    it("can save edit to user, with different (but available) email address", () => {
        
        navToEditRoute(userTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="userDetailsEmail"]').invoke("val", "").type(userForEmailChange.email);
            cy.get('[data-test="userDetailsForename"]').invoke("val", "").type("newName");
            cy.get('[data-test="userDetailsSurname"]').invoke("val", "").type("newSurname");
            
            cy.get('[data-test="userDetailsSaveBtn"]').click();
            
            cy.get('[data-savemessagetype="goodSaveMessage"]');
            
        });
        
    });
    
    
    it("can't change password if current password is wrong", () => {
        
        navToEditRoute(userTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="changePasswordCurrentInput"]').type("incorrectpassword");
            
            const newPassword = "newPassword123";
            cy.get('[data-test="passwordInput"]').type(newPassword);
            cy.get('[data-test="confirmPasswordInput"]').type(newPassword);
            
            cy.get('[data-test="changePasswordBtn"]').click();
            
            cy.get('[data-savemessagetype="badSaveMessage"]');
            
        });
        
    });
    
    
    it("can't change password if it doesn't match the confirmation password", () => {
        
        const user = userTestUsersFixture[0];
        
        navToEditRoute(user).then(() => {
            
            cy.get('[data-test="changePasswordCurrentInput"]').type(user.password);
            
            const newPassword = "newPassword123";
            cy.get('[data-test="passwordInput"]').type("somethingElse123");
            cy.get('[data-test="confirmPasswordInput"]').type(newPassword);
            
            cy.get('[data-test="changePasswordBtn"]').click();
            
            cy.get('[data-savemessagetype="badSaveMessage"]');
            
        });
        
    });
    
    
    it("can change password", () => {
        
        const user = userTestUsersFixture[0];
        
        navToEditRoute(user).then(() => {
            
            cy.get('[data-test="changePasswordCurrentInput"]').type(user.password);
            
            const newPassword = "newPassword123";
            cy.get('[data-test="passwordInput"]').type(newPassword);
            cy.get('[data-test="confirmPasswordInput"]').type(newPassword);
            
            cy.get('[data-test="changePasswordBtn"]').click();
            
            cy.get('[data-savemessagetype="goodSaveMessage"]');
            
        });
        
    });
    
    
    it("can use the back button to go to home route", () => {
        
        navToEditRoute(userTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="userDetailsBackButton"]').click();
            cy.url().should("eq", Cypress.config("baseUrl") + "/");
            
        });
        
    });
});