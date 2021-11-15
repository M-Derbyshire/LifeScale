import PasswordFormPartial from './PasswordFormPartial';
import { render } from '@testing-library/react';

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