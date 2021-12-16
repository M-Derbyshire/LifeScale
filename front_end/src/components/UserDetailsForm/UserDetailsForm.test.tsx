import UserDetailsForm from './UserDetailsForm';
import { render, fireEvent, screen } from '@testing-library/react';

const dummySetState = (x)=>{};
const dummySubmit = ()=>{};

test("UserDetailsForm will render a UserDetailsFormPartial", () => {
	
	const { container } = render(<UserDetailsForm 
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
])("UserDetailsForm will pass the user details to UserDetailsFormPartial", (testUser) => {
	
	render(<UserDetailsForm user={testUser} setUser={dummySetState} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
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
])("UserDetailsForm will set the user object when changing inputs in UserDetailsFormPartial", (newUserValues) => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const mockSetUser = jest.fn();
	
	render(<UserDetailsForm user={initialUser} setUser={mockSetUser} onSubmit={dummySubmit} setPasswordIsConfirmed={dummySetState} />);
	
	
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
	["test message 1"],
	["test message 2"]
])("UserDetailsForm will display the given badSaveErrorMessage prop in a BadSaveMessage", (message) => {
	
	//The password here has to be blank, so that the BadSaveMessage from the password form isn't caught
	const user = { 
		id:"test", email:"test@test.com", password:"", forename:"testFor", surname:"testSur" 
	};
	
	
	const { container } = render(<UserDetailsForm 
									user={user} 
									setUser={dummySetState} 
									onSubmit={dummySubmit} 
									setPasswordIsConfirmed={dummySetState}
									badSaveErrorMessage={message} />);
	
	const errorMessage = container.querySelector(".BadSaveMessage");
	
	expect(errorMessage).not.toBeNull();
	expect(errorMessage.textContent).toEqual(expect.stringContaining(message));
	
});



// test("UserDetailsForm will enable the submit button if the password is confirmed", () => {
	
// 	const initialUser = { 
// 		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
// 	};
	
// 	const { container } = render(<UserDetailsForm 
// 				user={initialUser} 
// 				setUser={dummySetState} 
// 				onSubmit={dummySubmit} 
// 				passwordIsConfirmed={true}
// 				setPasswordIsConfirmed={dummySetState} />);
	
// 	const submitButton = container.querySelector("input[type=submit]");
// 	expect(submitButton).not.toBeDisabled();
	
// });

// test("UserDetailsForm will disable the submit button if the password is not confirmed", () => {
	
// 	const initialUser = { 
// 		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
// 	};
	
// 	const { container } = render(<UserDetailsForm 
// 				user={initialUser} 
// 				setUser={dummySetState} 
// 				onSubmit={dummySubmit} 
// 				passwordIsConfirmed={false}
// 				setPasswordIsConfirmed={dummySetState} />);
	
// 	const submitButton = container.querySelector("input[type=submit]");
// 	expect(submitButton).toBeDisabled();
	
// });