import PasswordFormPartial from './PasswordFormPartial';
import { render } from '@testing-library/react';

const dummySetPassword = (password)=>{};

test("PasswordFormPartial will render the password field", ()=> {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetPassword} />);
	
	const password = container.querySelector(".passwordInput");
	
	expect(password).not.toBeNull();
	
});

test("PasswordFormPartial will render the password confirmation field", ()=> {
	
	const { container } = render(<PasswordFormPartial password={"test"} setPassword={dummySetPassword} />);
	
	const passwordConfirmation = container.querySelector(".confirmPasswordInput");
	
	expect(passwordConfirmation).not.toBeNull();
	
});