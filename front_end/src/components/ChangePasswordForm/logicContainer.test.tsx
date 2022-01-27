import ChangePasswordFormLogicContainer from './ChangePasswordFormLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


const setPasswordInputs = (container, expectedPasswordValues) => {
	
	const passwordInputs = container.querySelectorAll("input[type=password]");
	expect(passwordInputs.length).toBe(expectedPasswordValues.length);
	
	passwordInputs.forEach(
		(input, index) => fireEvent.change(input, { target: { value: expectedPasswordValues[index] } })
	);
	
	return {
		passwordInputs
	};
	
};




test("LogicContainer for ChangePasswordForm will render a ChangePasswordForm, and handle state-change/form-submission", () => {
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn().mockResolvedValue(mockUserService.getLoadedUser());
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	expect(container.querySelector(".ChangePasswordForm")).not.toBeNull();
	
	
	setPasswordInputs(container, expectedPasswordValues);
	
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	expect(mockUserService.updateLoadedUserPassword).toHaveBeenCalledWith(currentPassword, newPassword);
	
});



test("The logic container for ChangePasswordForm will not try to submit changes if the new password isn't confirmed", () => {
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn().mockResolvedValue(mockUserService.getLoadedUser());
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword + "extradata"
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	
	setPasswordInputs(container, expectedPasswordValues);	
	
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	expect(mockUserService.updateLoadedUserPassword).not.toHaveBeenCalled();
	
});



test("The logic container for ChangePasswordForm will pass a goodSaveMessage prop if saved successfully", async () => {
	
	const goodMessage = "Your password has now been changed.";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn().mockResolvedValue(mockUserService.getLoadedUser());
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	
	setPasswordInputs(container, expectedPasswordValues);	
	
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	await waitFor(() => expect(screen.getByText(goodMessage)).not.toBeNull());
	
});

test("The logic container for ChangePasswordForm will pass a badSaveErrorMessage prop if failed to save", async () => {
	
	const badMessage = "Your password has not been changed.";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn().mockRejectedValue(new Error(badMessage));
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	
	setPasswordInputs(container, expectedPasswordValues);	
	
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	await waitFor(() => expect(screen.getByText(badMessage)).not.toBeNull());
	
});




test("In the logic container for ChangePasswordForm a good save will clear previous bad save message", async () => {
	
	const goodMessage = "Your password has now been changed.";
	const badMessage = "Your password has not been changed.";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn().mockRejectedValue(new Error(badMessage));
	
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	
	setPasswordInputs(container, expectedPasswordValues);	
	
	//Get bad message
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	await waitFor(() => expect(screen.getByText(badMessage)).not.toBeNull());
	
	//Now get good message
	mockUserService.updateLoadedUserPassword = jest.fn().mockResolvedValue(mockUserService.getLoadedUser());
	
	fireEvent.click(saveButton);
	
	await waitFor(() => expect(screen.queryByText(badMessage)).toBeNull());
});





test("In the logic container for ChangePasswordForm a bad save will clear previous good save message", async () => {
	
	const goodMessage = "Your password has now been changed.";
	const badMessage = "Your password has not been changed.";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.updateLoadedUserPassword = jest.fn().mockResolvedValue(mockUserService.getLoadedUser());
	
	
	const currentPassword = "testOld";
	const newPassword = "testNew";
	const expectedPasswordValues = [
		currentPassword,
		newPassword,
		newPassword
	];
	
	const { container } = render(<ChangePasswordFormLogicContainer userService={mockUserService}/>);
	
	
	setPasswordInputs(container, expectedPasswordValues);	
	
	//Get good message
	const saveButton = container.querySelector(".ChangePasswordForm button");
	fireEvent.click(saveButton);
	
	await waitFor(() => expect(screen.getByText(goodMessage)).not.toBeNull());
	
	//Now get bad message
	mockUserService.updateLoadedUserPassword = jest.fn().mockRejectedValue(new Error(badMessage));
	
	fireEvent.click(saveButton);
	
	await waitFor(() => expect(screen.queryByText(goodMessage)).toBeNull());
});