import UserDetailsFormPartial from './UserDetailsFormPartial';
import { render, fireEvent } from '@testing-library/react';

const dummySetStrState = (x)=>{};


test.each([
	["email1@email.com"],
	["email2@email.com"]
])("UserDetailsFormPartial will set the email input value to the given email prop", (emailText) => {
	
	const { container } = render(<UserDetailsFormPartial 
		email={emailText} 
		forename="test" 
		surname="test" 
		setForename={dummySetStrState} 
		setSurname={dummySetStrState} 
		setEmail={dummySetStrState} />);
	
	const emailInput = container.querySelector("input[type=email]");
	
	expect(emailInput).not.toBeNull();
	expect(emailInput.value).toEqual(emailText);
});

test("UserDetailsFormPartial will call the setEmail callback when changing the email field", () => {
	
	const newVal = "newVal@test.com";
	const mockSetState = jest.fn();
	
	const { container } = render(<UserDetailsFormPartial 
		email="test@test.com" 
		forename="test" 
		surname="test" 
		setForename={dummySetStrState} 
		setSurname={dummySetStrState} 
		setEmail={mockSetState} />);
	
	const emailInput = container.querySelector("input[type=email]");
	
	fireEvent.change(emailInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});