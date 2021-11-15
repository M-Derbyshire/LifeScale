import RequestPasswordForm from './RequestPasswordForm';
import { render } from '@testing-library/react';

const dummySetEmail = (email)=>{};

test("RequestPasswordForm renders an email input", () => {
	
	const { container } = render(<RequestPasswordForm email="email@email.com" setEmail={dummySetEmail} />);
	
	const email = container.querySelector("form input[type=email]");
	
	expect(email).not.toBeNull();
	
});