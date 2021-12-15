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
									setUser={dummySetState} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
	const formPartial = container.querySelector(".UserDetailsFormPartial");
	
	expect(formPartial).not.toBeNull();
	
});

test.each([
	[{ id:"test", email:"test1@test1.com", password:"testPassword1", forename:"testFor1", surname:"testSur1" }],
	[{ id:"test", email:"test2@test2.com", password:"testPassword2", forename:"testFor2", surname:"testSur2" }]
])("CreateUserForm will pass the user details to UserDetailsFormPartial", (testUser) => {
	
	render(<CreateUserForm user={testUser} setUser={dummySetState} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
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
	
	render(<CreateUserForm user={initialUser} setUser={mockSetUser} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
	
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



test.each([
	[{ id:"test", email:"test1@test1.com", password:"testPassword1", forename:"testFor1", surname:"testSur1" }],
	[{ id:"test", email:"test2@test2.com", password:"testPassword2", forename:"testFor2", surname:"testSur2" }]
])("CreateUserForm will pass the user password to PasswordFormPartial", (testUser) => {
	
	render(<CreateUserForm user={testUser} setUser={dummySetState} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
	const passwordInput = screen.getByDisplayValue(testUser.password);
	expect(passwordInput).not.toBeNull();
	
});

test.each([
	[{ id:"test", email:"test1@test1.com", password:"testPassword1", forename:"testFor1", surname:"testSur1" }],
	[{ id:"test", email:"test2@test2.com", password:"testPassword2", forename:"testFor2", surname:"testSur2" }]
])("CreateUserForm will set the password state when changing password input in PasswordFormPartial", (newUserValues) => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const mockSetUser = jest.fn();
	
	render(<CreateUserForm user={initialUser} setUser={mockSetUser} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
	
	const passwordInput = screen.getByDisplayValue(initialUser.password);
	fireEvent.change(passwordInput, { target: { value: newUserValues.password } });
	expect(mockSetUser).toHaveBeenCalledWith({ ...initialUser, password: newUserValues.password });
	mockSetUser.mockClear();
	
});

test("CreateUserForm will set the password confirmed when changing password inputs in PasswordFormPartial", () => {
	
	//These all need to be set, so the password confirmation input isn't blank
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const newPassword = "testPass2";
	
	const mockSetUser = jest.fn();
	
	render(<CreateUserForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				setPasswordIsConfirmed={mockSetUser} />);
	
	const confirmedPasswordInput = screen.getByDisplayValue("");
	fireEvent.change(confirmedPasswordInput, { target: { value: newPassword } });
	mockSetUser.mockClear();
	
	const passwordInput = screen.getByDisplayValue(initialUser.password);
	fireEvent.change(passwordInput, { target: { value: "1234" } });
	expect(mockSetUser).toHaveBeenCalledWith(false);
	mockSetUser.mockClear();
	
	fireEvent.change(passwordInput, { target: { value: newPassword } });
	expect(mockSetUser).toHaveBeenCalledWith(true);
	
});



test.each([
	["test message 1"],
	["test message 2"]
])("CreateUserForm will display the given badSaveErrorMessage prop in a BadSaveMessage", (message) => {
	
	//The password here has to be blank, so that the BadSaveMessage from the password form isn't caught
	const user = { 
		id:"test", email:"test@test.com", password:"", forename:"testFor", surname:"testSur" 
	};
	
	
	const { container } = render(<CreateUserForm 
									user={user} 
									setUser={dummySetState} 
									onSubmit={dummySubmit} 
									setPasswordIsConfirmed={dummySetState}
									badSaveErrorMessage={message} />);
	
	const errorMessage = container.querySelector(".BadSaveMessage");
	
	expect(errorMessage).not.toBeNull();
	expect(errorMessage.textContent).toEqual(expect.stringContaining(message));
	
});