/// <reference types="../support" />

const loginRoute = "/login";
let authTestUsersFixture;

describe('Auth functionality', () => {
  
  beforeEach(() => {
    //Load the data used for the tests
    cy.fixture("auth-test-users").then((authTestUsers) => {
      authTestUsersFixture = authTestUsers;
      cy.setupUsersData(authTestUsers);
    });
  });
  
  
  // First, check we can't access auth routes when not logged in
  it("can't go to home route when not logged in", () => {
    cy.visit("/");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to user edit route when not logged in", () => {
    cy.visit("/user/edit");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to scale history route when not logged in", () => {
    cy.visit("/scale/history/id123");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to scale create route when not logged in", () => {
    cy.visit("/scale/create");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to scale edit route when not logged in", () => {
    cy.visit("/scale/edit/id123");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to scale view route when not logged in", () => {
    cy.visit("/scale/id123");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to category create route when not logged in", () => {
    cy.visit("/category/create/scaleid123");
    cy.url().should("include", loginRoute);
  });
  
  it("can't go to category edit route when not logged in", () => {
    cy.visit("/category/edit/scaleid123/categoryid123");
    cy.url().should("include", loginRoute);
  });
  
  
  
  
  // The request password form is usable
  it("can use and submit the request password form", () => {
    cy.visit(loginRoute);
    cy.get('[data-test="forgotPasswordLink"]').click();
    
    cy.url().should("include", "/forgotpassword");
    cy.get('[data-test="requestPasswordEmailInput"]').type(authTestUsersFixture[0].email)
    cy.get('[data-test="requestPasswordBtn"]').click();
    
    cy.get('[data-test="saveMessage"]');
  });
  
  it("can use the back button on the request password page", () => {
    cy.visit(loginRoute);
    cy.get('[data-test="forgotPasswordLink"]').click();
    cy.url().should("include", "/forgotpassword");
    
    cy.get('[data-test="requestPasswordBackBtn"]').click();
    cy.url().should("include", loginRoute);
  });
  
  
  
  // Now test login functionality
  it("can't login with the wrong email address", () => {
    cy.visit(loginRoute);
    
    cy.get('[data-test="loginEmailInput"]').type("incorrect@email.com");
    cy.get('[data-test="loginPasswordInput"]').type("password");
    
    cy.get('[data-test="loginBtn"]').click();
    
    cy.get('[data-savemessagetype="badSaveMessage"]');
  });
  
  it("can't login with the wrong password", () => {
    cy.visit(loginRoute);
    
    cy.get('[data-test="loginEmailInput"]').type(authTestUsersFixture[0].email);
    cy.get('[data-test="loginPasswordInput"]').type("incorrectpassword");
    
    cy.get('[data-test="loginBtn"]').click();
    
    cy.get('[data-savemessagetype="badSaveMessage"]');
  });
  
  it("can login with correct details", () => {
    cy.visit(loginRoute);
    
    cy.get('[data-test="loginEmailInput"]').type(authTestUsersFixture[0].email);
    cy.get('[data-test="loginPasswordInput"]').type(authTestUsersFixture[0].password);
    
    cy.get('[data-test="loginBtn"]').click();
    
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
  
  it("can logout", () => {
    cy.visit(loginRoute);
    
    cy.get('[data-test="loginEmailInput"]').type(authTestUsersFixture[0].email);
    cy.get('[data-test="loginPasswordInput"]').type(authTestUsersFixture[0].password);
    
    cy.get('[data-test="loginBtn"]').click();
    
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
    
    cy.get('[data-test="logoutNavLink"]').click();
    
    cy.url().should("include", loginRoute);
    
    //Confirm can't get back in
    cy.visit("/");
    cy.url().should("include", loginRoute);
  });
  
})