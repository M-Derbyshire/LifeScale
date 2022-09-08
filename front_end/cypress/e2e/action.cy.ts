/// <reference types="../support" />

import IUser from "../../src/interfaces/IUser";

describe("Action functionality", () => {
    
    const scaleViewRouteBase = "/scale/"; //Add ID to end of this
    const scaleEditRouteBase = "/scale/edit/"; //Add ID to end of this
    const categoryRouteBase = "/category/edit/"; // add scale id, then category id, to this
    
    let actionTestUsersFixture:(Omit<IUser, "id"> & { password:string })[];
    
    
    beforeEach(() => {
        //Load the data used for the tests
        cy.fixture("action-test-users").then((actionTestUsers) => {
            actionTestUsersFixture = actionTestUsers;
            cy.setupUsersData(actionTestUsers);
        });
    });
    
    after(() => {
        cy.deleteGivenUsers(actionTestUsersFixture);
    });
    
    
    
    //Should put your test code in .then() of result
    //Should only be used on scale with single category
    const navToSingleCategoryEditRoute = (scaleID:string, user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user)
            .then(() => cy.get(`a[href="${scaleViewRouteBase + scaleID}"]`).click()) //using .visit() can make the app think we're logged out
            .then(() => cy.get(`[data-test="scaleEditButton"]`).click())
            .then(() => cy.get('[data-test="editableItemEditBtn"]').click());
    };
    
    
    
    
    // -- Creation ------------------------------------------------------
    
    it("Can't save a new action with blank data", () => {
        
        const user = actionTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToSingleCategoryEditRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="actionNameInput"]').invoke("val", "");
            cy.get('[data-test="actionWeightInput"]').invoke("val", "");
            
            cy.get('[data-test="actionSaveBtn"]').click();
            
            cy.get('[data-test="actionNameInput"]:invalid');
            cy.get('[data-test="actionWeightInput"]:invalid');
            
        });
        
    });
    
    
    it("Can save a new action, and it gets added to the list", () => {
        
        const user = actionTestUsersFixture[0];
        const initialScale = user.scales[0];
        const initialActionCount = initialScale.categories[0].actions.length;
        
        const newName = "newAction";
        const newWeight = "100";
        
        navToSingleCategoryEditRoute(initialScale.id, user).then(() => {
            
            //Not sure if the new action form will be displayed by default in the future, so being more explicit here
            cy.get('[data-test="singleActionForm"] [data-test="actionNameInput"]:not([value=""])')
                .should("have.length", initialActionCount);
            
            cy.get('[data-test="newActionFormDisplayBtn"]').click();
            
            cy.get('[data-test="actionNameInput"][value=""]').should("not.have.value", newName).invoke("val", "").type(newName);
            cy.get('[data-test="actionWeightInput"][value="0"]').should("not.have.value", newWeight).invoke("val", "").type(newWeight);
            
            //Want to make sure we get the one for the new action form
            cy.get(`[data-test="actionSaveBtn"]`).first().click();
            
            cy.get('[data-test="singleActionForm"] [data-test="actionNameInput"]:not([value=""])')
                .should("have.length", initialActionCount + 1);
            cy.get('[data-test="actionDeleteBtn"]').should("have.length", initialActionCount + 1);
        });
        
    });
    
    
    // -- Editing ---------------------------------------------------------------------
    
    it("Can't save an existing action with blank data", () => {
        
        const user = actionTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToSingleCategoryEditRoute(scaleID, user).then(() => {
            
            //Need to make sure we're not selecting the new action form (incase it's displayed by default in the future)
            cy.get('[data-test="actionNameInput"]:not([value=""])').invoke("val", "");
            cy.get('[data-test="actionWeightInput"]:not([value="0"])').invoke("val", "");
            
            cy.get('[data-test="actionSaveBtn"]').click();
            
            cy.get('[data-test="actionNameInput"]:invalid');
            cy.get('[data-test="actionWeightInput"]:invalid');
            
        });
        
    });
    
    
    it("Can save an existing action", () => {
        
        const user = actionTestUsersFixture[0];
        const initialScaleID = user.scales[0].id;
        const initialScale = user.scales[0];
        const initialAction = initialScale.categories[0].actions[0];
        const initialActionCount = initialScale.categories[0].actions.length;
        
        const newName = "newActionData";
        const newWeight = "100";
        
        navToSingleCategoryEditRoute(initialScaleID, user).then(() => {
            
            //Not sure if the new action form will be displayed by default in the future, so being more explicit here
            cy.get('[data-test="singleActionForm"] [data-test="actionNameInput"]:not([value=""])')
                .should("have.length", initialActionCount);
            
            cy.get(`[data-test="actionNameInput"][value="${initialAction.name}"]`)
                .should("not.have.value", newName).invoke("val", "").type(newName);
            cy.get(`[data-test="actionWeightInput"][value="${initialAction.weight}"]`)
                .should("not.have.value", newWeight).invoke("val", "").type(newWeight);
            
            
            cy.get(`[data-test="actionSaveBtn"]`).last().click();
            
            
            cy.get('[data-test="actionNameInput"]:not([value=""])').should("have.value", newName);
            cy.get('[data-test="actionWeightInput"]:not([value="0"])').should("have.value", newWeight);
            cy.get('[data-test="singleActionForm"] div[data-savemessagetype="goodSaveMessage"]');
        });
        
    });
    
    
    
    it("Can delete an action, and it gets removed to the list", () => {
        
        const user = actionTestUsersFixture[0];
        const initialScaleID = user.scales[0].id;
        const initialScale = user.scales[0];
        const initialActionCount = initialScale.categories[0].actions.length;
        
        navToSingleCategoryEditRoute(initialScaleID, user).then(() => {
            
            cy.get('[data-test="actionDeleteBtn"]').should("have.length", initialActionCount);
            
            cy.get(`[data-test="actionDeleteBtn"]`).first().click();
            
            cy.get('[data-test="actionDeleteBtn"]').should("have.length", initialActionCount - 1);
        });
        
    });
    
});