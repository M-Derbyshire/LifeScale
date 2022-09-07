/// <reference types="../support" />

import IUser from "../../src/interfaces/IUser";


describe("Scale functionality", () => {
    
    const createRoute = "/scale/create";
    const viewRouteBase = "/scale/"; //Add ID to end of this
    const editRouteBase = "/scale/edit/";
    
    let scaleTestUsersFixture:(Omit<IUser, "id"> & { password:string })[];
    
    
    beforeEach(() => {
        //Load the data used for the tests
        cy.fixture("scale-test-users").then((scaleTestUsers) => {
            scaleTestUsersFixture = scaleTestUsers;
            cy.setupUsersData(scaleTestUsers);
        });
    });
    
    after(() => {
        cy.deleteGivenUsers(scaleTestUsersFixture);
    });
    
    
    //Should put your test code in .then() of result
    const navToCreateRoute = (user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user).then(() => {
            return cy.get('[data-test="createScaleNavLink"]').click(); //using .visit() can make the app think we're logged out
        });
    };
    
    const navToEditRoute = (scaleID:string, user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user)
            .then(() => cy.get(`a[href="${viewRouteBase + scaleID}"]`).click()) //using .visit() can make the app think we're logged out
            .then(() => cy.get(`[data-test="scaleEditButton"]`).click());
    };
    
    
    
    
    
    
    // -- Navigation -------------------------------------
    
    it("Can use the link to the create page, and then use the back button to go back to the home page", () => {
        
        const user = scaleTestUsersFixture[0];
        
        cy.loginUser(user).then(() => {
            
            cy.get(`[data-test="createScaleNavLink"]`).click();
            cy.url().should("contain", createRoute);
            
            cy.get('[data-test="scaleDetailsBackBtn"]').click();
            cy.url().should("eq", Cypress.config("baseUrl") + "/");
        });
        
    });
    
    it("Can use the link to the scale page, navigate to the edit page, and then use the back button to go back to the scale page", () => {
        
        const user = scaleTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        cy.loginUser(user).then(() => {
            
            cy.get(`a[href="${viewRouteBase + scaleID}"]`).click();
            cy.url().should("contain", viewRouteBase + scaleID);
            
            cy.get(`[data-test="scaleEditButton"]`).click();
            cy.url().should("contain", editRouteBase + scaleID);
            
            cy.get('[data-test="scaleDetailsBackBtn"]').click();
            cy.url().should("contain", viewRouteBase + scaleID);
        });
        
    });
    
    
    // -- Creation -----------------------------------------
    
    it("Can't create scale with blank data", () => {
        
        navToCreateRoute(scaleTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="scaleNameInput"]').invoke("val", ""); //Should already be, but set anyway, just incase in the future
            cy.get('[data-test="scaleDayCountInput"]').invoke("val", "");
            
            cy.get('[data-test="scaleDetailsSaveBtn"]').click();
            
            cy.get('[data-test="scaleNameInput"]:invalid');
            cy.get('[data-test="scaleDayCountInput"]:invalid');
        });
        
    });
    
    
    it("Will redirect to new scale's page after creating a new scale", () => {
        
        navToCreateRoute(scaleTestUsersFixture[0]).then(() => {
            
            cy.get('[data-test="scaleNameInput"]').invoke("val", "").type("testScale2");
            cy.get('[data-test="scaleDayCountInput"]').invoke("val", "").type("7");
            
            cy.get(`[data-test="scaleUsesTimespansInput"]`).should("not.be.checked").check().should("be.checked");
            
            cy.get('[data-test="scaleDetailsSaveBtn"]').click();
            
            cy.url().should("contain", viewRouteBase);
            cy.url().should("not.contain", editRouteBase); //Want to make sure it isn't the edit route, as both would pass the above
        });
        
    });
    
    
    // -- Editing ---------------------------------------
    
    it("Can't save edit of scale if blank data", () => {
        
        const user = scaleTestUsersFixture[0];
        
        navToEditRoute(user.scales[0].id, user).then(() => {
            
            cy.get('[data-test="scaleNameInput"]').invoke("val", "");
            cy.get('[data-test="scaleDayCountInput"]').invoke("val", "");
            
            cy.get('[data-test="scaleDetailsSaveBtn"]').click();
            
            cy.get('[data-test="scaleNameInput"]:invalid');
            cy.get('[data-test="scaleDayCountInput"]:invalid');
            
        });
        
    });
    
    it("Can save edit of scale", () => {
        
        const user = scaleTestUsersFixture[0];
        const updatedName = "updatedName";
        const updatedCount = 10;
        
        navToEditRoute(user.scales[0].id, user).then(() => {
            
            cy.get('[data-test="scaleNameInput"]').invoke("val", "").type(updatedName);
            cy.get('[data-test="scaleDayCountInput"]').invoke("val", "").type(updatedCount.toString());
            cy.get(`[data-test="scaleUsesTimespansInput"]`).should("be.checked").uncheck().should("not.be.checked");
            
            cy.get('[data-test="scaleDetailsSaveBtn"]').click();
            
            
            cy.get('[data-savemessagetype="goodSaveMessage"]');
            cy.get('[data-test="scaleNameInput"]').should("have.value", updatedName);
            cy.get('[data-test="scaleDayCountInput"]').should("have.value", updatedCount.toString());
            cy.get(`[data-test="scaleUsesTimespansInput"]`).should("not.be.checked");
        });
        
    });
    
    
    
    it("Can delete a scale", () => {
        
        const user = scaleTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        cy.loginUser(user).then(() => {
            
            cy.get('[data-test="scaleNavLink"]').should("have.length", user.scales.length);
            
            cy.get(`a[href="${viewRouteBase + scaleID}"]`).click();
            cy.url().should("contain", viewRouteBase + scaleID);
            
            cy.get(`[data-test="scaleEditButton"]`).click();
            cy.url().should("contain", editRouteBase + scaleID);
            
            
            //Delete, and make sure removed from nav list
            cy.get('[data-test="scaleDeleteBtn"]').click();
            cy.url().should("eq", Cypress.config("baseUrl") + "/");
            cy.get('[data-test="scaleNavLink"]').should("have.length", user.scales.length - 1);
        });
        
        
    });
    
    
});