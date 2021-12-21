import ChangePasswordForm from './ChangePasswordForm';
import { render, fireEvent } from '@testing-library/react';

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
									newPasswordIsConfirmed={true}
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
									newPasswordIsConfirmed={true}
									setNewPasswordIsConfirmed={dummySetState}
									onSubmit={dummySubmit} />);
	
	const currentPasswordInput = container.querySelector(".currentPasswordInput");
	
	fireEvent.change(currentPasswordInput, { target: { value: newValue } });
	
	expect(mockSetState).toHaveBeenCalledWith(newValue);
	
});