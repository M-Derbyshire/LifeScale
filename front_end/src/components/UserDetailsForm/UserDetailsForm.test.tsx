import UserDetailsForm from './UserDetailsForm';
import { render, fireEvent, screen } from '@testing-library/react';

const dummySetState = (x)=>{};
const dummySubmit = ()=>{};
const dummyBackHandler = ()=>{};

test("UserDetailsForm will render a UserDetailsFormPartial", () => {
	
	const { container } = render(<UserDetailsForm 
									user={ {
										id:"test", 
										email:"test@test.com",
										password:"test", 
										forename:"test", 
										surname: "test"
									} }
									setUser={dummySetState} 
									onSubmit={dummySubmit} 
									headingText="test"
									backButtonHandler={dummyBackHandler}  />);
	
	const formPartial = container.querySelector(".UserDetailsFormPartial");
	
	expect(formPartial).not.toBeNull();
	
});

test.each([
	[{ id:"test", email:"test1@test1.com", password:"testPassword1", forename:"testFor1", surname:"testSur1" }],
	[{ id:"test", email:"test2@test2.com", password:"testPassword2", forename:"testFor2", surname:"testSur2" }]
])("UserDetailsForm will pass the user details to UserDetailsFormPartial", (testUser) => {
	
	render(<UserDetailsForm 
				user={testUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test"
				backButtonHandler={dummyBackHandler}  />);
	
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
	
	render(<UserDetailsForm 
				user={initialUser} 
				setUser={mockSetUser} 
				onSubmit={dummySubmit} 
				headingText="test"
				backButtonHandler={dummyBackHandler}  />);
	
	
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
									headingText="test" 
									badSaveErrorMessage={message}
									backButtonHandler={dummyBackHandler} />);
	
	const errorMessage = container.querySelector(".BadSaveMessage");
	
	expect(errorMessage).not.toBeNull();
	expect(errorMessage.textContent).toEqual(expect.stringContaining(message));
	
});



test("UserDetailsForm will enable the submit button if no disableSubmit prop is passed in", () => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				headingText="test" 
				onSubmit={dummySubmit}
				backButtonHandler={dummyBackHandler} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("UserDetailsForm will enable the submit button if the disableSubmit prop is passed false", () => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit}
				headingText="test" 
				disableSubmit={false}
				backButtonHandler={dummyBackHandler} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("UserDetailsForm will disable the submit button if the disableSubmit prop is passed true", () => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test" 
				disableSubmit={true}
				backButtonHandler={dummyBackHandler} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).toBeDisabled();
	
});



test.each([
	["test1"],
	["test2"]
])("UserDetailsForm will set the submit button text to the given submitButtontext prop", (buttonText) => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test" 
				submitButtonText={buttonText}
				backButtonHandler={dummyBackHandler} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	
	expect(submitButton.value).toEqual(buttonText);
	
});


test.each([
	["test1"],
	["test2"]
])("UserDetailsForm will set the h1 text to the given headingText prop", (headText) => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText={headText}
				submitButtonText="test"
				backButtonHandler={dummyBackHandler} />);
	
	const heading = container.querySelector("h1");
	
	expect(heading.textContent).toEqual(headText);
	
});


test("If a passwordForm prop is passed, UserDetailsForm will render it", () => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	
	const testDivClassname = "testPasswordForm";
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test"
				submitButtonText="test"
				backButtonHandler={dummyBackHandler}
				passwordForm={<div className={testDivClassname}></div>} />);
	
	const passwordForm = container.querySelector(`.${testDivClassname}`);
	
	expect(passwordForm).not.toBeNull();
	
});


test("UserDetailsForm will render content in a LoadedContentWrapper", () => {
	
	const initialUser = { 
		id:"test", email:"test@test.com", password:"testPassword", forename:"testFor", surname:"testSur" 
	};
	
	const { container } = render(<UserDetailsForm 
				user={initialUser} 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test"
				submitButtonText="test"
				backButtonHandler={dummyBackHandler} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const emailInput = screen.getByDisplayValue(initialUser.email);
	
	expect(contentWrapper).not.toBeNull();
	expect(emailInput).not.toBeNull();
	
});

test.each([
	["message 1"],
	["message 2"]
])("UserDetailsForm will render passed badLoadErrorMessage prop in a LoadedContentWrapper", (messageText) => {
	
	const { container } = render(<UserDetailsForm 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test"
				submitButtonText="test"
				badLoadErrorMessage={messageText}
				backButtonHandler={dummyBackHandler} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const messageElem = screen.getByText(messageText);
	
	expect(contentWrapper).not.toBeNull();
	expect(messageElem).not.toBeNull();
	
});

test("UserDetailsForm will not render anything in LoadedContentWrapper, when not passed a IUser or badSaveMessage", () => {
	
	const { container } = render(<UserDetailsForm 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test"
				submitButtonText="test"
				backButtonHandler={dummyBackHandler} />);
	
	const loadingDisplay = container.querySelector(`.currentlyLoadingDisplay`);
	
	expect(loadingDisplay).not.toBeNull();
});


test("UserDetailsForm will call the backButtonHandler prop if the back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	
	const { container } = render(<UserDetailsForm 
				setUser={dummySetState} 
				onSubmit={dummySubmit} 
				headingText="test"
				submitButtonText="test"
				backButtonHandler={mockBackHandler} />);
	
	const backButton = container.querySelector(".userDetailsBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
});