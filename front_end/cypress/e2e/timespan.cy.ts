/// <reference types="../support" />

import IUser from "../../src/interfaces/IUser";

describe("Timespan functionality", () => {
    
    const viewScaleRouteBase = "/scale/"; //Add ID to end of this
    const scaleHistoryRouteBase = "/scale/history/"; //Add ID to the end of this
    let timespanTestUsersFixture:(Omit<IUser, "id"> & { password:string })[];
    
    
    beforeEach(() => {
        //Load the data used for the tests
        cy.fixture("timespan-test-users").then((timespanTestUsers) => {
            timespanTestUsersFixture = timespanTestUsers;
            cy.setupUsersData(timespanTestUsers);
        });
    });
    
    after(() => {
        cy.deleteGivenUsers(timespanTestUsersFixture);
    });
    
    
    
    const navToScaleViewRoute = (scaleID:string, user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user)
            .then(() => cy.get(`a[href="${viewScaleRouteBase + scaleID}"]`).click());
    };
    
    const navToHistoryAmendRoute = (scaleID:string, user:(Omit<IUser, "id"> & { password:string })) => {
        return cy.loginUser(user)
            .then(() => cy.get(`a[href="${viewScaleRouteBase + scaleID}"]`).click())
            .then(() => cy.get('[data-test="amendActionHistoryNavBtn"]').click());
    };
    
    
    
    // -- Navigation ----------------------------------------------------
    
    it("Can navigate to the Amend Action History page, and then go back to the scale view route", () => {
        
        const user = timespanTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToScaleViewRoute(scaleID, user).then(() => {
            
            cy.get('[data-test="amendActionHistoryNavBtn"]').click();
            cy.url().should("include", scaleHistoryRouteBase);
            
            cy.get('[data-test="actionHistoryBackButton"]').click();
            cy.url().should("not.include", scaleHistoryRouteBase); //Amend route includes the base of the view route, so double-checking
            cy.url().should("include", viewScaleRouteBase);
            
        });
        
    });
    
    
    
    
    
    // -- Recording functions -----------------------------------------------------------
    
    const recordWithBlankData = () => {
        //Only need to set the minute, as it's linked to hour input
        cy.get('[data-test="timespanMinuteInput"]').invoke("val", "");
            
        cy.get('[data-test="recordActionSaveBtn"]').click();
        
        cy.get('[data-test="timespanMinuteInput"]:invalid');
    };
    
    
    const recordCorrectly = (newMin:string, newCategoryName:string, newActionName:string) => {
        //Only need to set the minute, as it's linked to hour input
        cy.get('[data-test="timespanMinuteInput"]')
            .should("not.have.value", newMin).invoke("val", "").type(newMin).should("have.value", newMin);
        
        cy.get('[data-test="recordActionCategorySelect"] option:selected').should("not.have.text", newCategoryName);
        cy.get('[data-test="recordActionCategorySelect"]').select(newCategoryName);
        cy.get('[data-test="recordActionCategorySelect"] option:selected').should("have.text", newCategoryName);
        
        cy.get('[data-test="recordActionActionSelect"] option:selected').should("not.have.text", newActionName);
        cy.get('[data-test="recordActionActionSelect"]').select(newActionName);
        cy.get('[data-test="recordActionActionSelect"] option:selected').should("have.text", newActionName);
        
        //Date is handled by DatePicker (3rd party) component
        cy.get('.react-datepicker-wrapper');
        
        
        cy.get('[data-test="recordActionSaveBtn"]').click();
        
        
        cy.get('[data-savemessagetype="goodSaveMessage"]');
    };
    
    
    
    // -- Creation (at view route) ------------------------------------------------------
    
    
    it("Can't record an action occurence with blank time data, on the scale view page", () => {
        
        const user = timespanTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToScaleViewRoute(scaleID, user).then(() => {
            recordWithBlankData();
        });
        
    });
    
    it("Can record an action occurence, on the scale view page", () => {
        
        const user = timespanTestUsersFixture[0];
        const scale = user.scales[0];
        const scaleID = scale.id;
        
        const newMin = "100";
        const newCategoryName = scale.categories[1].name;
        const newActionName = scale.categories[1].actions[1].name;
        
        
        
        navToScaleViewRoute(scaleID, user).then(() => {
            recordCorrectly(newMin, newCategoryName, newActionName);
        });
        
    });
    
    
    // -- Amend screen ------------------------------------------------------------------
    
    
    it("Can't record an action occurence with blank time data, on the amend history page", () => {
        
        const user = timespanTestUsersFixture[0];
        const scaleID = user.scales[0].id;
        
        navToHistoryAmendRoute(scaleID, user).then(() => {
            recordWithBlankData();
        });
        
    });
    
    it("Can record an action occurence, on the amend history page", () => {
        
        const user = timespanTestUsersFixture[0];
        const scale = user.scales[0];
        const scaleID = scale.id;
        
        const newMin = "100";
        const newCategoryName = scale.categories[1].name;
        const newActionName = scale.categories[1].actions[1].name;
        
        
        
        navToHistoryAmendRoute(scaleID, user).then(() => {
            recordCorrectly(newMin, newCategoryName, newActionName);
        });
        
    });
    
    
    it("Can delete action occurences, on the amend history page", () => {
        
        const user = timespanTestUsersFixture[0];
        const scale = user.scales[0];
        const scaleID = scale.id;
        
        const timespanCount = scale.categories.reduce((catAcc, cat) => {
            
            return catAcc + cat.actions.reduce((actAcc, act) => {
                
                return actAcc + act.timespans.length;
                
            }, 0);
            
        }, 0);
        
        navToHistoryAmendRoute(scaleID, user).then(() => {
            cy.get('[data-test="actionHistoryItem"]').should("have.length", timespanCount);
            cy.get('[data-test="actionHistoryDeleteBtn"]').first().click();
            cy.get('[data-test="actionHistoryItem"]').should("have.length", timespanCount - 1);
        });
        
    });
});