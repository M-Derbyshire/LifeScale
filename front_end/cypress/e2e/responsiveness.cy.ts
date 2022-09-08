/// <reference types="../support" />

import IUser from "../../src/interfaces/IUser";


describe("Responsive navigation bar functionality", () => {
    
    const editUserLink = "/user/edit";
    const createScaleRoute = "/scale/create";
    const viewScaleRouteBase = "/scale/";
    const editScaleRouteBase = "/scale/edit/";
    const editActionHistoryRouteBase = "/scale/history/";
    const loginRoute = "/login";
    
    const smallScreenWidth = 760;
    
    let testUsersFixture:(Omit<IUser, "id"> & { password:string })[];
    
    
    
    beforeEach(() => {
        
        // Set to a small screen width
        cy.viewport(smallScreenWidth, 1000);
        
        //Load the data used for the tests
        cy.fixture("responsive-test-users").then((testUsers) => {
            testUsersFixture = testUsers;
            cy.setupUsersData(testUsers);
        });
    });
    
    after(() => {
        cy.deleteGivenUsers(testUsersFixture);
    });
    
    
    
    // -- Dropdown -----------------------------------
    
    it("Navigation bar can be dropped down, and then back up", () => {
        
        const user = testUsersFixture[0];
        
        cy.loginUser(user).then(() => {
            
            cy.get('[data-test="userNavBar"]').should("not.be.visible");
            
            cy.get('[data-test="dropdownToggleIcon"]').click();
            
            cy.get('[data-test="userNavBar"]').should("be.visible");
            
            cy.get('[data-test="dropdownToggleIcon"]').click();
            
            cy.get('[data-test="userNavBar"]').should("not.be.visible");
        });
        
    });
    
    
    // -- Navigation --------------------------------
    
    it("Dropdown Navigation Bar can be used to navigate to the edit user link", () => {
        
        const user = testUsersFixture[0];
        
        cy.loginUser(user).then(() => {
            
            cy.get('[data-test="userNavBar"]').should("not.be.visible");
            cy.get('[data-test="dropdownToggleIcon"]').click();
            
            cy.get('[data-test="editUserNavLink"]').click();
            cy.url().should("contain", editUserLink);
        });
    });
    
    
    it("Dropdown Navigation Bar can be used to logout", () => {
        
        const user = testUsersFixture[0];
        
        cy.loginUser(user).then(() => {
            
            cy.get('[data-test="userNavBar"]').should("not.be.visible");
            cy.get('[data-test="dropdownToggleIcon"]').click();
            
            cy.get('[data-test="logoutNavLink"]').click();
            cy.url().should("contain", loginRoute);
        });
    });
    
    
    it("Dropdown Navigation Bar can be used to navigate to the create scale link", () => {
        
        const user = testUsersFixture[0];
        
        cy.loginUser(user).then(() => {
            
            cy.get('[data-test="userNavBar"]').should("not.be.visible");
            cy.get('[data-test="dropdownToggleIcon"]').click();
            
            cy.get('[data-test="createScaleNavLink"]').click();
            cy.url().should("contain", createScaleRoute);
        });
    });
    
    
    it("Dropdown Navigation Bar can be used to navigate with a view scale link", () => {
        
        const user = testUsersFixture[0];
        
        cy.loginUser(user).then(() => {
            
            cy.get('[data-test="userNavBar"]').should("not.be.visible");
            cy.get('[data-test="dropdownToggleIcon"]').click();
            
            cy.get('[data-test="scaleNavLink"]').click();
            cy.url().should("contain", viewScaleRouteBase);
            
            //The below strings contain the view scale route base, so just confirming it's not them
            cy.url().should("not.contain", createScaleRoute);
            cy.url().should("not.contain", editScaleRouteBase);
            cy.url().should("not.contain", editActionHistoryRouteBase);
        });
    });
    
});