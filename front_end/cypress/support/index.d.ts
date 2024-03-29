/// <reference types="cypress" />

import IUser from "../../src/interfaces/IUser";

declare namespace Cypress {
    interface Chainable<Subject> {
        setupUsersData(users: IUser[]): void;
        deleteGivenUsers(users: IUser[]): void;
        loginUser(user:(Omit<IUser, "id"> & { password:string })): Cypress.Chainable<JQuery<HTMLElement>>;
    }
  }