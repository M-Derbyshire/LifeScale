import RequestPasswordPageLogicContainer from './RequestPasswordPageLogicContainer';
import { render, fireEvent } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService'

test("Logic container for RequestPasswordPage will render a RequestPasswordPage component", () => {
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={new TestingDummyUserService()} /> );
	
	expect(container.querySelector(".RequestPasswordPage")).not.toBeNull();
	
});


test("Logic container for RequestPasswordPage will handle the state and submission of form data", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.requestNewPassword = jest.fn();
	
	const expectedEmailValue = "test1@test1.com";
	
	const { container } = render(<RequestPasswordPageLogicContainer 
									userService={mockUserService} /> );
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: expectedEmailValue } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockUserService.requestNewPassword).toHaveBeenCalledWith(expectedEmailValue);
	
});