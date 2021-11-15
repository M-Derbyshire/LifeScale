import LoginForm from './LoginForm';
import { render, fireEvent } from '@testing-library/react';


const dummySetState = (x)=>{};
const dummyOnSubmit = ()=>{};

test.each([
	["email1@email.com"],
	["email2@email.com"]
])("LoginForm renders the email prop as the email", (email) => {
	
	const { container } = render(<LoginForm email={email}  />);
	
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