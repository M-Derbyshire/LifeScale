/// <reference types="../support" />

describe('Auth functionality', () => {
  
  beforeEach(() => {
    //Load the data used for the tests
    cy.fixture("auth-test-users").then((authTestUsers) => cy.setupUsersData(authTestUsers));
  });
  
  it('passes', () => {
    
  })
})