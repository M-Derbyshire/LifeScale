import ChangePasswordForm from './ChangePasswordForm';
import { render, fireEvent, screen } from '@testing-library/react';

const dummySetState = (x) => {};
const dummySubmit = ()=>{};

test.each([
	["test1"],
	["test2"]
])("ChangePasswordForm will render the current password in an input", (currentPassword) => {
	
	const { container } = render(<ChangePasswordForm 
									currentPassword={currentPassword}
									setCurrentPassword={dummySetState}
									newPassword="test"
									setNewPassword={dummySetState}
									setNewPasswordIsConfirmed={dummySetState}
									onSubmit={dummySubmit} />);
	
	const currentPasswordInput = container.querySelector(".currentPasswordInput");
	
	expect(currentPasswordInput.value).toBe(currentPassword);
	
});

test("ChangePasswordForm will set the currentPassword state when changing the current password", () => {
	
	const newValue = "newValue";
	const mockSetState = jest.fn();
	
	const { container } = render(<ChangePasswordForm 
									currentPassword={"firstValue"}
									setCurrentPassword={mockSetState}
									newPassword="test"
									setNewPassword={dummySetState}
									setNewPasswordIsConfirmed={dummySetState}
									onSubmit={dummySubmit} />);
	
	const currentPasswordInput = container.querySelector(".currentPasswordInput");
	
	fireEvent.change(currentPasswordInput, { target: { value: newValue } });
	
	expect(mockSetState).toHaveBeenCalledWith(newValue);
	
});



test.each([
	["test1"],
	["test2"]
])("ChangePasswordForm will render a PasswordFormPartial, and pass it the new password", (newPassword) => {
	
	const { container } = render(<ChangePasswordForm 
									currentPassword={"test"}
									setCurrentPassword={dummySetState}
									newPassword={newPassword}
									setNewPassword={dummySetState}
									setNewPasswordIsConfirmed={dummySetState}
									onSubmit={dummySubmit} />);
	
	const PasswordFormPartial = container.querySelector(".PasswordFormPartial");
	expect(PasswordFormPartial).not.toBeNull();
	
	const newPasswordInput = screen.getByDisplayValue(newPassword);
	expect(newPasswordInput).not.toBeNull();
	
});

test("ChangePasswordForm will pass the setNewPassword state to PasswordFormPartial", () => {
	
	const newValue = "newValue";
	const mockSetState = jest.fn();
	
	const { container } = render(<ChangePasswordForm 
									currentPassword={"test"}
									setCurrentPassword={dummySetState}
									newPassword={"testNewPassword"}
									setNewPassword={mockSetState}
									setNewPasswordIsConfirmed={dummySetState}
									onSubmit={dummySubmit} />);
	
	const newPasswordInput = screen.getByDisplayValue("testNewPassword");
	fireEvent.change(newPasswordInput, { target: { value: newValue } });
	
	expect(mockSetState).toHaveBeenCalledWith(newValue);
	
});

test("ChangePasswordForm will pass the setNewPasswordIsConfirmed state to PasswordFormPartial", () => {
	
	const newValue = "newValue";
	const mockSetState = jest.fn();
	
	const { container } = render(<ChangePasswordForm 
									currentPassword={"test"}
									setCurrentPassword={dummySetState}
									newPassword={newValue}
									setNewPassword={dummySetState}
									setNewPasswordIsConfirmed={mockSetState}
									onSubmit={dummySubmit} />);
	
	const confirmPasswordInput = container.querySelector(".confirmPasswordInput");
	fireEvent.change(confirmPasswordInput, { target: { value: newValue } });
	
	expect(mockSetState).toHaveBeenCalledWith(true);
	
});



test("ChangePasswordForm render a button (not a submit input, as this may be rendered within another form), and call onSubmit prop onclick", () => {
	
	const mockOnSubmit = jest.fn();
	
	const { container } = render(<ChangePasswordForm 
									currentPassword={"test"}
									setCurrentPassword={dummySetState}
									newPassword={"test"}
									setNewPassword={dummySetState}
									setNewPasswordIsConfirmed={dummySetState}
									onSubmit={mockOnSubmit} />);
	
	const submitButton = container.querySelector("button[type=button]");
	fireEvent.click(submitButton);
	
	expect(mockOnSubmit).toHaveBeenCalled();
	
});




test.each([
	["test1"],
	["test2"]
])("If given a badSaveErrorMessage prop, ChangePasswordForm will render the message", (errorMessage) => {
	
	render(<ChangePasswordForm 
				currentPassword={"test"}
				setCurrentPassword={dummySetState}
				newPassword={"test"}
				setNewPassword={dummySetState}
				setNewPasswordIsConfirmed={dummySetState}
				onSubmit={dummySetState}
				badSaveErrorMessage={errorMessage} />);
	
	const errorDisplay = screen.getByText(errorMessage);
	expect(errorDisplay).not.toBeNull();
	
});

test.each([
	["test1"],
	["test2"]
])("If given a goodSaveMessage prop, ChangePasswordForm will render the message", (message) => {
	
	render(<ChangePasswordForm 
				currentPassword={"test"}
				setCurrentPassword={dummySetState}
				newPassword={"test"}
				setNewPassword={dummySetState}
				setNewPasswordIsConfirmed={dummySetState}
				onSubmit={dummySetState}
				goodSaveMessage={message} />);
	
	const errorDisplay = screen.getByText(message);
	expect(errorDisplay).not.toBeNull();
	
});