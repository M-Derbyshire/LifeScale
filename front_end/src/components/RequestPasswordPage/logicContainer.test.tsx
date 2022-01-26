import RequestPasswordPageLogicContainer from './RequestPasswordPageLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService'

test("Logic container for RequestPasswordPage will render a RequestPasswordPage component", () => {
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={new TestingDummyUserService()} /> );
	
	expect(container.querySelector(".RequestPasswordPage")).not.toBeNull();
	
});


test("Logic container for RequestPasswordPage will handle the state and submission of form data", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.requestNewPassword = jest.fn().mockResolvedValue(null);
	
	const expectedEmailValue = "test1@test1.com";
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: expectedEmailValue } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockUserService.requestNewPassword).toHaveBeenCalledWith(expectedEmailValue);
	
});

test("Logic container for RequestPasswordPage will pass on good save messages", async () => {
	
	const saveMessage = "A new password has now been sent via email.";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.requestNewPassword = (email:string) => new Promise((resolve, reject) => resolve(null));
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	
	await waitFor(
		() => expect(screen.getByText(saveMessage)).not.toBeNull()
	);
	
});