import LoginForm from './LoginForm';
import { render, fireEvent } from '@testing-library/react';


const dummySetState = (x)=>{};
const dummyOnSubmit = ()=>{};

test.each([
	["email1@email.com"],
	["email2@email.com"]
])("LoginForm renders the email prop as the email", (email) => {
	
	const { container } = render(<LoginForm email={email} password="123" setEmail={dummySetState} setPassword={dummySetState} onSubmit={dummyOnSubmit}  />);
	
	const emailInput = container.querySelector("form input[type=email]");
	
	expect(emailInput).not.toBeNull();
	expect(emailInput.value).toEqual(email);
	
});


test("LoginForm will use the setEmail prop as the email onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = "test1@test.com";
	
	const { container } = render(<LoginForm email="test@test.com" password="123" setEmail={mockCB} setPassword={dummySetState} onSubmit={dummyOnSubmit} />);
	
	const emailInput = container.querySelector("form input[type=email]");
	
	fireEvent.change(emailInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});



test.each([
	["password1"],
	["password2"]
])("LoginForm renders the password prop as the password", (password) => {
	
	const { container } = render(<LoginForm email="test@test.com" password={password} setEmail={dummySetState} setPassword={dummySetState} onSubmit={dummyOnSubmit}  />);
	
	const passwordInput = container.querySelector("form input[type=password]");
	
	expect(passwordInput).not.toBeNull();
	expect(passwordInput.value).toEqual(password);
	
});


test("LoginForm will use the setPassword prop as the password onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = "password1";
	
	const { container } = render(<LoginForm email="test@test.com" password="password" setEmail={dummySetState} setPassword={mockCB} onSubmit={dummyOnSubmit} />);
	
	const passwordInput = container.querySelector("form input[type=password]");
	
	fireEvent.change(passwordInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});



test("LoginForm will call the onSubmit handler prop when submitted", () => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<LoginForm email="test@test.com" password="password" setEmail={dummySetState} setPassword={dummySetState} onSubmit={mockCB} />);
	
	//Checking this to make sure it's there, as fireEvent.submit() should actually be used (virtual dom doesn't implement submit)
	const submit = container.querySelector("form input[type=submit]");
	expect(submit).not.toBeNull();
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockCB).toHaveBeenCalled();
	
});


test.each([
	["test1"],
	["test2"]
])("LoginForm renders a BadSaveMessage component for the given badSaveErrorMessage props", (message) => {
	
	const { container } = render(<LoginForm 
									email={"test@test.com"} 
									password="123" 
									setEmail={dummySetState} 
									setPassword={dummySetState} 
									onSubmit={dummyOnSubmit}
									badSaveErrorMessage={message} />);
	
	const saveMessage = container.querySelector(".BadSaveMessage");
	
	expect(saveMessage).not.toBeNull();
	expect(saveMessage.textContent).toEqual(message);
	
});