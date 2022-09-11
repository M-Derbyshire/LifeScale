import PasswordFormPartial from './PasswordFormPartial';
import { render, fireEvent } from '@testing-library/react';

const dummySetState = (x)=>{};

test("PasswordFormPartial will render the password field", ()=> {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	
	const password = container.querySelector(".passwordInput");
	
	expect(password).not.toBeNull();
	
});

test("PasswordFormPartial will render the password confirmation field", ()=> {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	
	const passwordConfirmation = container.querySelector(".confirmPasswordInput");
	
	expect(passwordConfirmation).not.toBeNull();
	
});



test.each([
	["password1"],
	["password2"]
])("PasswordFormPartial will set the password value to match the given password prop", (passwordText)=> {
	
	const { container } = render(<PasswordFormPartial password={passwordText} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	
	const password = container.querySelector(".passwordInput");
	
	expect(password.value).toEqual(passwordText);
	
});

test("PasswordFormPartial will call the setPassword prop with the given password change", ()=> {
	
	const mockSetState = jest.fn();
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={mockSetState} setPasswordIsConfirmed={dummySetState} />);
	
	const password = container.querySelector(".passwordInput");
	
	
	const newVal = "test1";
	fireEvent.change(password, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});



test("PasswordFormPartial will maintain the changed password confirmation value", ()=> {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	
	const passwordConfirmation = container.querySelector(".confirmPasswordInput");
	
	expect(passwordConfirmation.value).toEqual("");
	
	
	const newVal = "test1";
	fireEvent.change(passwordConfirmation, { target: { value: newVal } });
	expect(passwordConfirmation.value).toEqual(newVal);
	
});



test("PasswordFormPartial will call the setPasswordIsConfirmed prop with correct values when changing confirmation password", () => {
	
	const mockSetState = jest.fn();
	const { container } = render(<PasswordFormPartial password={""} setPassword={dummySetState} setPasswordIsConfirmed={mockSetState} />);
	
	const passwordConfirmation = container.querySelector(".confirmPasswordInput");
	
	fireEvent.change(passwordConfirmation, { target: { value: "testValNoMatch" } }); // call 1 - false
	
	fireEvent.change(passwordConfirmation, { target: { value: "" } }); // call 2 - true
	
	expect(mockSetState).toHaveBeenNthCalledWith(1, false);
	expect(mockSetState).toHaveBeenNthCalledWith(2, true);
	
});

test("PasswordFormPartial will call the setPasswordIsConfirmed prop with correct values when changing password", () => {
	
	const mockSetState = jest.fn();
	
	//Since we can't use useState in a test, you need to leave the default password as "test". If you set to an empty string, the second call to mockSetState
	//will not be called, as the value will already be an empty string
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={mockSetState} />);
	
	const password = container.querySelector(".passwordInput");
	
	fireEvent.change(password, { target: { value: "testValNoMatch" } }); // call 1 - false
	fireEvent.change(password, { target: { value: "" } }); // call 2 - true
	
	expect(mockSetState).toHaveBeenNthCalledWith(1, false);
	expect(mockSetState).toHaveBeenNthCalledWith(2, true);
	
});



test("PasswordFormPartial will render a BadSaveMessage if the passwords don't match", () => {
	
	const { container } = render(<PasswordFormPartial password={"match"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	const passwordConfirmation = container.querySelector(".confirmPasswordInput");
	
	expect(container.querySelector(".BadSaveMessage")).not.toBeNull();
	
	fireEvent.change(passwordConfirmation, { target: { value: "match" } });
	expect(container.querySelector(".BadSaveMessage")).toBeNull();
	
	fireEvent.change(passwordConfirmation, { target: { value: "testValNoMatch" } });
	expect(container.querySelector(".BadSaveMessage")).not.toBeNull();
	
});




test("PasswordFormPartial - If no passwordLabel prop is provided, the labels will just use 'Password'", () => {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	
	const passwordLabel = container.querySelector(".passwordInputLabel");
	const confirmationLabel = container.querySelector(".confirmPasswordInputLabel");
	
	expect(passwordLabel.textContent).toEqual(expect.stringContaining("Password: "));
	expect(confirmationLabel.textContent).toEqual(expect.stringContaining("Confirm Password: "));
	
});

test.each([
	["test"],
	["New Password"]
])("If passwordLabel prop is provided, the labels in PasswordFormPartial will use it", (labelText) => {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} passwordLabel={labelText} />);
	
	const passwordLabel = container.querySelector(".passwordInputLabel");
	const confirmationLabel = container.querySelector(".confirmPasswordInputLabel");
	
	expect(passwordLabel.textContent).toEqual(expect.stringContaining(`${labelText}: `));
	expect(confirmationLabel.textContent).toEqual(expect.stringContaining(`Confirm ${labelText}: `));
	
});

test("If passwordLabel prop isset to an empty string, the labels in PasswordFormPartial will use the default 'Password'", () => {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} passwordLabel={""} />);
	
	const passwordLabel = container.querySelector(".passwordInputLabel");
	const confirmationLabel = container.querySelector(".confirmPasswordInputLabel");
	
	expect(passwordLabel.textContent).toEqual(expect.stringContaining("Password: "));
	expect(confirmationLabel.textContent).toEqual(expect.stringContaining("Confirm Password: "));
	
});