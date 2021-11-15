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

test("PasswordFormPartial will maintain the changed password confirmation value", ()=> {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetState} setPasswordIsConfirmed={dummySetState} />);
	
	const passwordConfirmation = container.querySelector(".confirmPasswordInput");
	
	expect(passwordConfirmation.value).toEqual("");
	
	
	const newVal = "test1"
	fireEvent.change(passwordConfirmation, { target: { value: newVal } });
	expect(passwordConfirmation.value).toEqual(newVal);
	
});