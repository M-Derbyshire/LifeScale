import ChangePasswordFormLogicContainer from './ChangePasswordFormLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

test("LogicContainer for ChangePasswordForm will render a ChangePasswordForm, and handle state-change/form-submission", () => {
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn();
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	expect(container.querySelector(".ChangePasswordForm")).not.toBeNull();
	
	
	const passwordInputs = container.querySelectorAll("input[type=password]");
	expect(passwordInputs.length).toBe(expectedPasswordValues.length);
	
	passwordInputs.forEach(
		(input, index) => fireEvent.change(input, { target: { value: expectedPasswordValues[index] } })
	);
	
	
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	expect(mockUserService.updateLoadedUserPassword).toHaveBeenCalledWith(currentPassword, newPassword);
	
});

//won't try to save if password not confirmed

//good save message

//bad save message

//good save clears bad save message

//bad save clears good save message

