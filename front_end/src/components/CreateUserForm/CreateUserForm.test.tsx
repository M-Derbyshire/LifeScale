import CreateUserForm from './CreateUserForm';
import { render, fireEvent, screen } from '@testing-library/react';

const dummySetState = (x)=>{};
const dummySubmit = ()=>{};

test("CreateUserForm will render a UserDetailsFormPartial", () => {
	
	const { container } = render(<CreateUserForm 
									user={ {
										id:"test", 
										email:"test@test.com",
										password:"test", 
										forename:"test", 
										surname: "test"
									} }
									setUser={dummySetState} onSubmit={dummySubmit} />);
	
	const formPartial = container.querySelector(".UserDetailsFormPartial");
	
	expect(formPartial).not.toBeNull();
	
});

test.each([
	[{ id:"test", email:"test1@test1.com", password:"testPassword1", forename:"testFor1", surname:"testSur1" }],
	[{ id:"test", email:"test2@test2.com", password:"testPassword2", forename:"testFor2", surname:"testSur2" }]
])("CreateUserForm will pass the user details to UserDetailsFormPartial", (testUser) => {
	
	render(<CreateUserForm user={testUser} setUser={dummySetState} onSubmit={dummySubmit} />);
	
	const emailInput = screen.getByDisplayValue(testUser.email);
	expect(emailInput).not.toBeNull();
	
	const forenameInput = screen.getByDisplayValue(testUser.forename);
	expect(forenameInput).not.toBeNull();
	
	const surnameInput = screen.getByDisplayValue(testUser.surname);
	expect(surnameInput).not.toBeNull();
	
});

test.each([
	[{ id:"test", email:"test1@test1.com", password:"testPassword1", forename:"testFor1", surname:"testSur1" }],
	[{ id:"test", email:"test2@test2.com", password:"testPassword2", forename:"testFor2", surname:"testSur2" }]
])("CreateUserForm will set the user object when changing inputs in UserDetailsFormPartial", (newUserValues) => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const mockSetUser = jest.fn();
	
	render(<CreateUserForm user={initialUser} setUser={mockSetUser} onSubmit={dummySubmit} />);
	
	
	const emailInput = screen.getByDisplayValue(initialUser.email);
	fireEvent.change(emailInput, { target: { value: newUserValues.email } });
	expect(mockSetUser).toHaveBeenCalledWith({ ...initialUser, email: newUserValues.email });
	mockSetUser.mockClear();
	
	const forenameInput = screen.getByDisplayValue(initialUser.forename);
	fireEvent.change(forenameInput, { target: { value: newUserValues.forename } });
	expect(mockSetUser).toHaveBeenCalledWith({ ...initialUser, forename: newUserValues.forename });
	mockSetUser.mockClear();
	
	const surnameInput = screen.getByDisplayValue(initialUser.surname);
	fireEvent.change(surnameInput, { target: { value: newUserValues.surname } });
	expect(mockSetUser).toHaveBeenCalledWith({ ...initialUser, surname: newUserValues.surname });
	mockSetUser.mockClear();
	
});