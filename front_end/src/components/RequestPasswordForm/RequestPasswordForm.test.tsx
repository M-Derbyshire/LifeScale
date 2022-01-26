import RequestPasswordForm from './RequestPasswordForm';
import { render, fireEvent } from '@testing-library/react';

const dummySetEmail = (email)=>{};
const dummySubmitCB = ()=>{};
const dummyBackCB = ()=>{};

test("RequestPasswordForm renders an email input", () => {
	
	const { container } = render(<RequestPasswordForm 
									email="email@email.com" 
									setEmail={dummySetEmail} 
									onSubmit={dummySubmitCB}
									backButtonHandler={dummyBackCB} />);
	
	const email = container.querySelector("form input[type=email]");
	
	expect(email).not.toBeNull();
	
});

test("RequestPasswordForm will call the onSubmit handler prop when submitted", () => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<RequestPasswordForm 
									email="email@email.com" 
									setEmail={dummySetEmail} 
									onSubmit={mockCB}
									backButtonHandler={dummyBackCB} />);
	
	//Checking this to make sure it's there, as fireEvent.submit() should actually be used (virtual dom doesn't implement submit)
	const submit = container.querySelector("form input[type=submit]");
	expect(submit).not.toBeNull();
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockCB).toHaveBeenCalled();
	
});

test.each([
	["email1@email.com"],
	["email2@email.com"]
])("RequestPasswordForm renders the email prop as the email", (email) => {
	
	const { container } = render(<RequestPasswordForm 
									email={email} 
									setEmail={dummySetEmail} 
									onSubmit={dummySubmitCB}
									backButtonHandler={dummyBackCB} />);
	
	const emailInput = container.querySelector("form input[type=email]");
	
	expect(emailInput).not.toBeNull();
	expect(emailInput.value).toEqual(email);
	
});

test("RequestPasswordForm will use the setEmail prop as the email onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = "test1@test.com";
	
	const { container } = render(<RequestPasswordForm 
									email="test@test.com" 
									setEmail={mockCB} 
									onSubmit={dummySubmitCB}
									backButtonHandler={dummyBackCB} />);
	
	const emailInput = container.querySelector("form input[type=email]");
	
	fireEvent.change(emailInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});


test.each([
	["test"],
	["test2"]
])("RequestPasswordForm will render a BadSaveMessage when passed the message as a prop", (message) => {
	
	const { container } = render(<RequestPasswordForm 
									email="test@test.com" 
									setEmail={dummySetEmail} 
									onSubmit={dummySubmitCB}
									badSaveErrorMessage={message}
									backButtonHandler={dummyBackCB} />);
	
	const messageDisplay = container.querySelector(".BadSaveMessage");
	
	expect(messageDisplay).not.toBeNull();
	expect(messageDisplay.textContent).toEqual(expect.stringContaining(message));
	
});

test.each([
	["test"],
	["test2"]
])("RequestPasswordForm will render a GoodSaveMessage when passed the message as a prop", (message) => {
	
	const { container } = render(<RequestPasswordForm 
									email="test@test.com" 
									setEmail={dummySetEmail} 
									onSubmit={dummySubmitCB}
									goodSaveMessage={message}
									backButtonHandler={dummyBackCB} />);
	
	const messageDisplay = container.querySelector(".GoodSaveMessage");
	
	expect(messageDisplay).not.toBeNull();
	expect(messageDisplay.textContent).toEqual(expect.stringContaining(message));
	
});

test("RequestPasswordForm will call the given backButtonHandler prop when back button clicked", () => {
	
	const mockBackCallback = jest.fn();
	
	const { container } = render(<RequestPasswordForm 
									email="test@test.com" 
									setEmail={dummySetEmail} 
									onSubmit={dummySubmitCB}
									backButtonHandler={mockBackCallback} />);
	
	const backButton = container.querySelector(".RequestPasswordForm .backButton");
	
	fireEvent.click(backButton);
	
	expect(mockBackCallback).toHaveBeenCalled();
	
});