/// <reference types="cypress" />
import IUser from '../../src/interfaces/IUser';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


Cypress.Commands.add('setupUsersData', (users:IUser[]) => {
    
    cy.fixture("api-config").then((apiConfig) => {
        
        
        users.forEach(user => {
            
            const postUser = () => cy.request("POST", `${apiConfig.baseUrl}/users`, user); //call regardless of whether the user was found
            
            cy.request("GET", `${apiConfig.baseUrl}/users?email=${user.email}`).then(response => {
                
                if(response.body.length > 0 && response.body[0].hasOwnProperty("id")) //did we find it?
                {
                    cy.request("DELETE", `${apiConfig.baseUrl}/users/${response.body[0].id}`).then(() => {
                        postUser();
                    });
                }
                else
                {
                    postUser();
                }
                
            });
            
        });
        
        
    });
});