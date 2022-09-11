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




test.each([
	["test1"],
	["test2"]
])("UserDetailsFormPartial will set the forename input value to the given forename prop", (forenameText) => {
	
	const { container } = render(<UserDetailsFormPartial 
		email="test@test.com" 
		forename={forenameText} 
		surname="test" 
		setForename={dummySetStrState} 
		setSurname={dummySetStrState} 
		setEmail={dummySetStrState} />);
	
	const forenameInput = container.querySelector(".userForenameInput");
	
	expect(forenameInput).not.toBeNull();
	expect(forenameInput.value).toEqual(forenameText);
});

test("UserDetailsFormPartial will call the setforename callback when changing the forename field", () => {
	
	const newVal = "newVal";
	const mockSetState = jest.fn();
	
	const { container } = render(<UserDetailsFormPartial 
		email="test@test.com" 
		forename="test" 
		surname="test" 
		setForename={mockSetState} 
		setSurname={dummySetStrState} 
		setEmail={dummySetStrState} />);
	
	const forenameInput = container.querySelector(".userForenameInput");
	
	fireEvent.change(forenameInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});





test.each([
	["test1"],
	["test2"]
])("UserDetailsFormPartial will set the surname input value to the given surname prop", (surnameText) => {
	
	const { container } = render(<UserDetailsFormPartial 
		email="test@test.com" 
		forename="test" 
		surname={surnameText} 
		setForename={dummySetStrState} 
		setSurname={dummySetStrState} 
		setEmail={dummySetStrState} />);
	
	const surnameInput = container.querySelector(".userSurnameInput");
	
	expect(surnameInput).not.toBeNull();
	expect(surnameInput.value).toEqual(surnameText);
});

test("UserDetailsFormPartial will call the setSurname callback when changing the surname field", () => {
	
	const newVal = "newVal";
	const mockSetState = jest.fn();
	
	const { container } = render(<UserDetailsFormPartial 
		email="test@test.com" 
		forename="test" 
		surname="test" 
		setForename={dummySetStrState} 
		setSurname={mockSetState} 
		setEmail={dummySetStrState} />);
	
	const surnameInput = container.querySelector(".userSurnameInput");
	
	fireEvent.change(surnameInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});