import RequestPasswordForm from './RequestPasswordForm';
import { render, fireEvent } from '@testing-library/react';

const dummySetEmail = (email)=>{};
const dummySubmitCB = ()=>{};

test("RequestPasswordForm renders an email input", () => {
	
	const { container } = render(<RequestPasswordForm email="email@email.com" setEmail={dummySetEmail} onSubmit={dummySubmitCB} />);
	
	const email = container.querySelector("form input[type=email]");
	
	expect(email).not.toBeNull();
	
});

test("RequestPasswordForm will call the onSubmit handler prop when submitted", () => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<RequestPasswordForm email="email@email.com" setEmail={dummySetEmail} onSubmit={mockCB} />);
	
	//Checking this to make sure it's there, as fireEvent.submit() should actually be used (virtual dom doesn't implement submit)
	const submit = container.querySelector("form input[type=submit]");
	expect(submit).not.toBeNull();
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockCB).toHaveBeenCalled();
	
});