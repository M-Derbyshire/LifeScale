/// <reference types="../support" />

import IUser from "../../src/interfaces/IUser";
import CategoryColorProvider from '../../src/utility_classes/CategoryColorProvider/CategoryColorProvider';


describe("Category functionality", () => {
    
    const scaleViewRouteBase = "/scale/"; //Add ID to end of this
    const scaleEditRouteBase = "/scale/edit/"; //Add ID to end of this
    
    const createRouteBase = "/category/create/"; // add scale id to this
    const editRouteBase = "/category/edit/"; // add scale id, then category id, to this
    
    const categoryColorProvider = new CategoryColorProvider();
    
    let categoryTestUsersFixture:(Omit<IUser, "id"> & { password:string })[];
    
    
    beforeEach(() => {
        //Load the data used for the tests
        cy.fixture("category-test-users").then((categoryTestUsers) => {
            categoryTestUsersFixture = categoryTestUsers;
            cy.setupUsersData(categoryTestUsers);
        });
    });
    
    after(() => {
        cy.deleteGivenUsers(categoryTestUsersFixture);
    });
    
    
    
    //Should put your test code in .then() of result
    const navToCreateRoute = (scaleID:string, user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user)
            .then(() => cy.get(`a[href="${scaleViewRouteBase + scaleID}"]`).click()) //using .visit() can make the app think we're logged out
            .then(() => cy.get(`[data-test="scaleEditButton"]`).click())
            .then(() => cy.get('[data-test="addItemCard"]').click());
    };
    
    //Should put your test code in .then() of result
    //Should only be used on category with single scale
    const navToSingleCategoryEditRoute = (scaleID:string, user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user)
            .then(() => cy.get(`a[href="${scaleViewRouteBase + scaleID}"]`).click()) //using .visit() can make the app think we're logged out
            .then(() => cy.get(`[data-test="scaleEditButton"]`).click())
            .then(() => cy.get('[data-test="editableItemEditBtn"]').click());
    };
    
    
    
    // -- Navigation ------------------------------
    
    it("Can use the new category link, and then use the back button to go back to the scale edit page", () => {
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        cy.loginUser(user).then(() => {
            
            cy.get(`a[href="${scaleViewRouteBase + scaleID}"]`).click();
            cy.get(`[data-test="scaleEditButton"]`).click();
            cy.get('[data-test="addItemCard"]').click();
            
            cy.url().should("contain", createRouteBase + scaleID);
            
            cy.get('[data-test="categoryDetailsBackButton"]').click();
            cy.url().should("contain", scaleEditRouteBase + scaleID);
        });
        
    });
    
    it("Can use the edit category button, and then use the back button to go back to the scale edit page", () => {
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        cy.loginUser(user).then(() => {
            
            cy.get(`a[href="${scaleViewRouteBase + scaleID}"]`).click();
            cy.get(`[data-test="scaleEditButton"]`).click();
            cy.get('[data-test="editableItemEditBtn"]').click();
            
            cy.url().should("contain", editRouteBase + scaleID);
            
            cy.get('[data-test="categoryDetailsBackButton"]').click();
            cy.url().should("contain", scaleEditRouteBase + scaleID);
        });
        
    });
    
    
    
    
    
    // -- Creation ------------------------------------
    
    it("Can't create a category with blank data", () => {
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToCreateRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="categoryNameInput"]').invoke("val", "");
            cy.get('[data-test="categoryDesiredWeightInput"]').invoke("val", "");
            
            cy.get('[data-test="categorySaveBtn"]').click();
            
            cy.get('[data-test="categoryNameInput"]:invalid');
            cy.get('[data-test="categoryDesiredWeightInput"]:invalid');
            
        });
        
    });
    
    
    it("Can create a category, and goes back to scale edit route afterwards", () => {
        
        const categoryName = "newTestName123";
        const categoryWeight = "5";
        const categoryColor = categoryColorProvider.getColorList()[1].colorRealValue;
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToCreateRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="categoryNameInput"]').invoke("val", "").type(categoryName);
            cy.get('[data-test="categoryDesiredWeightInput"]').invoke("val", "").type(categoryWeight);
            cy.get('[data-test="categoryColorSelect"]')
                .should("have.value", categoryColorProvider.getColorList()[0].colorRealValue)
                .select(categoryColor)
                .should("have.value", categoryColor);
            
            cy.get('[data-test="categorySaveBtn"]').click();
            
            cy.url().should("contain", scaleEditRouteBase + scaleID);
            cy.get('[data-test="editableItemEditBtn"]').should("have.length", user.scales[0].categories.length + 1);
            
        });
        
    });
    
    
    
    // -- Editing ------------------------------------------------------
    
    
    it("Can't save an edited category with blank data", () => {
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToSingleCategoryEditRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="categoryNameInput"]').invoke("val", "");
            cy.get('[data-test="categoryDesiredWeightInput"]').invoke("val", "");
            
            cy.get('[data-test="categorySaveBtn"]').click();
            
            cy.get('[data-test="categoryNameInput"]:invalid');
            cy.get('[data-test="categoryDesiredWeightInput"]:invalid');
            
        });
        
    });
    
    
    it("Can save an edited category", () => {
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        const categoryNewName = "newTestName123";
        const categorNewyWeight = "5";
        const categoryNewColor = categoryColorProvider.getColorList()[0].colorRealValue;
        
        navToSingleCategoryEditRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="categoryNameInput"]').invoke("val", "").type(categoryNewName);
            cy.get('[data-test="categoryDesiredWeightInput"]').invoke("val", "").type(categorNewyWeight);
            cy.get('[data-test="categoryColorSelect"]')
                .should("not.have.value", categoryColorProvider.getColorList()[0].colorRealValue)
                .select(categoryNewColor);
            
            cy.get('[data-test="categorySaveBtn"]').click();
            
            cy.get('[data-savemessagetype="goodSaveMessage"]');
            cy.get('[data-test="categoryNameInput"]').should("have.value", categoryNewName);
            cy.get('[data-test="categoryDesiredWeightInput"]').should("have.value", categorNewyWeight);
            cy.get('[data-test="categoryColorSelect"]').should("have.value", categoryNewColor);
            
        });
        
    });
    
    
    it("Can delete a category, and will be returned to scale edit route", () => {
        
        const user = categoryTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToSingleCategoryEditRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="categoryDeleteBtn"]').click();
            
            cy.url().should("include", scaleEditRouteBase + scaleID);
            cy.get('[data-test="editableItemEditBtn"]').should("have.length", user.scales[0].categories.length - 1);
        });
        
    });
    
    
});