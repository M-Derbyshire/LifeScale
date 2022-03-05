import RequestPasswordPageLogicContainer from './RequestPasswordPageLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService'

const dummyBackHandler = ()=>{};

test("Logic container for RequestPasswordPage will render a RequestPasswordPage component", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={dummyBackHandler} /> );
	
	expect(container.querySelector(".RequestPasswordPage")).not.toBeNull();
	
});


test("Logic container for RequestPasswordPage will handle the state and submission of form data", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.requestNewPassword = jest.fn().mockResolvedValue(null);
	
	const expectedEmailValue = "test1@test1.com";
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={dummyBackHandler} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: expectedEmailValue } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockUserService.requestNewPassword).toHaveBeenCalledWith(expectedEmailValue);
	
});

test("Logic container for RequestPasswordPage will pass on good save messages", async () => {
	
	const saveMessage = "A new password has now been sent via email.";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.requestNewPassword = (email:string) => new Promise((resolve, reject) => resolve(null));
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={dummyBackHandler} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	
	await waitFor(
		() => expect(screen.getByText(saveMessage)).not.toBeNull()
	);
	
});

test("Logic container for RequestPasswordPage will pass down bad save messages", async () => {
	
	const saveMessage = "There was a problem with this request";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.requestNewPassword = 
		(email:string) => new Promise((resolve, reject) => reject(new Error(saveMessage)));
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={dummyBackHandler} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	
	await waitFor(
		() => expect(screen.getByText(saveMessage)).not.toBeNull()
	);
	
});


test("In logic container for RequestPasswordPage, a good request will clear the bad request message", async () => {
	
	const saveMessage = "There was a problem with this request";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.requestNewPassword = 
		(email:string) => new Promise((resolve, reject) => reject(new Error(saveMessage)));
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={dummyBackHandler} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	
	//Rejecting promise to get error
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(
		() => expect(screen.queryByText(saveMessage)).not.toBeNull()
	);
	
	//Now get good save message
	
	mockUserService.requestNewPassword = (email:string) => new Promise((resolve, reject) => resolve(null));
	
	fireEvent.submit(form);
	
	await waitFor(
		() => expect(screen.queryByText(saveMessage)).toBeNull()
	);
	
});



test("In logic container for RequestPasswordPage, a bad request will clear the good request message", async () => {
	
	const saveMessage = "A new password has now been sent via email.";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.requestNewPassword = (email:string) => new Promise((resolve, reject) => resolve(null));
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={dummyBackHandler} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	
	//Resolve promise to get good save message
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(
		() => expect(screen.queryByText(saveMessage)).not.toBeNull()
	);
	
	//Now get error save message
	
	mockUserService.requestNewPassword = 
		(email:string) => new Promise((resolve, reject) => reject(new Error("error")));
	
	fireEvent.submit(form);
	
	await waitFor(
		() => expect(screen.queryByText(saveMessage)).toBeNull()
	);
	
});


test("Logic container for RequestPasswordPage will pass the given backButtonHandler prop into the RequestPasswordPage", () => {
	
	const mockBackCallback = jest.fn();
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService}
									backButtonHandler={mockBackCallback} /> );
	
	const backButton = container.querySelector(".RequestPasswordForm .backButton");
	
	fireEvent.click(backButton);
	
	expect(mockBackCallback).toHaveBeenCalled();
	
});



test("RequestPasswordPage logic container will call userService abortRequests method on unmount", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = jest.fn();
	
	const { container, unmount } = render(<RequestPasswordPageLogicContainer 
		userService={mockUserService}
		backButtonHandler={dummyBackHandler} /> );
	
	
	unmount();
	
	expect(mockUserService.abortRequests).toHaveBeenCalled();
	
});