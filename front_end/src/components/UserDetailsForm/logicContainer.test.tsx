import UserDetailsFormLogicContainer from './UserDetailsFormLogicContainer';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

const dummyBackHandler = ()=>{};

test("UserDetailsFormLogicContainer will render a UserDetailsForm", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	expect(container.querySelector(".UserDetailsForm")).not.toBeNull();
	
});

test("UserDetailsFormLogicContainer will handle the state and submission of UserDetailsForm when creating", () => {
	
	const userToCreate = {
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	//The below 2 are not included in the above object, as will only be there at different times
	const userToCreateId = "jashashsdh";
	const userToCreatePassword = "testpass";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.createUser = jest.fn().mockResolvedValue({ ...userToCreate, id: userToCreateId });
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: userToCreate.email } });
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: userToCreate.forename } });
	
	const surnameInput = container.querySelector(".userSurnameInput");
	fireEvent.change(surnameInput, { target: { value: userToCreate.surname } });
	
	const passwordInputs = container.querySelectorAll("input[type=password]");
	passwordInputs.forEach(input => fireEvent.change(input, { target: { value: userToCreatePassword } }));
	
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	expect(mockUserService.createUser).toHaveBeenCalledWith({ ...userToCreate, password: userToCreatePassword });
	
});

test("UserDetailsFormLogicContainer will not create user if the password is not confirmed", () => {
	
	const userToCreate = {
		email: "test@test.com",
		password: "testpass",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.createUser = jest.fn();
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: userToCreate.email } });
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: userToCreate.forename } });
	
	const surnameInput = container.querySelector(".userSurnameInput");
	fireEvent.change(surnameInput, { target: { value: userToCreate.surname } });
	
	
	//Set one password to be incorrect
	const passwordInputs = container.querySelectorAll("input[type=password]");
	expect(passwordInputs.length).toBe(2);
	fireEvent.change(passwordInputs[0], { target: { value: userToCreate.password } });
	fireEvent.change(passwordInputs[1], { target: { value: userToCreate.password + "1234" } });
	
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	expect(mockUserService.createUser).not.toHaveBeenCalled();
	
});

test("UserDetailsFormLogicContainer will handle the state and submission of UserDetailsForm when editing", async () => {
	
	const userToLoad = {
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	const userNewValues = {
		email: "test2@test.com",
		forename: "test2",
		surname: "testing2",
		scales: []
	};
	
	//The below is not included in the above object, as will only be there at different times
	const userToLoadId = "jashashsdh";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.getLoadedUser = () => { return { ...userToLoad, id: userToLoadId }; };
	mockUserService.updateLoadedUser = jest.fn().mockResolvedValue({ ...userNewValues, id: userToLoadId });
	
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={false}
									backButtonHandler={dummyBackHandler} />);
	
	const emailInput = screen.getByDisplayValue(userToLoad.email);
	fireEvent.change(emailInput, { target: { value: userNewValues.email } });
	
	const forenameInput = screen.getByDisplayValue(userToLoad.forename);
	fireEvent.change(forenameInput, { target: { value: userNewValues.forename } });
	
	const surnameInput = screen.getByDisplayValue(userToLoad.surname);
	fireEvent.change(surnameInput, { target: { value: userNewValues.surname } });
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => expect(mockUserService.updateLoadedUser)
							.toHaveBeenCalledWith({ ...userNewValues, id: userToLoadId }));
	
});

test("UserDetailsFormLogicContainer will render a ChangePasswordFormLogicContainer when editing loaded user, not a PasswordFormPartial", () => {
	
	const userToLoad = {
		id: "fjshdfkjhafhs",
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.getLoadedUser = () => userToLoad;
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={false}
									backButtonHandler={dummyBackHandler} />);
	
	expect(container.querySelector(".ChangePasswordFormLogicContainer")).not.toBeNull();
	expect(container.querySelector(".UserDetailsForm > .PasswordFormPartial")).toBeNull();
	
});

test("UserDetailsFormLogicContainer will not render a ChangePasswordFormLogicContainer when creating a user, but instead a PasswordFormPartial", () => {
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	expect(container.querySelector(".ChangePasswordFormLogicContainer")).toBeNull();
	expect(container.querySelector(".PasswordFormPartial")).not.toBeNull();
	
});


test("UserDetailsFormLogicContainer will not render any password forms after creating a user", async () => {
	
	const userToCreate = {
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	//The below 2 are not included in the above object, as will only be there at different times
	const userToCreateId = "jashashsdh";
	const userToCreatePassword = "testpass";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.createUser = jest.fn().mockResolvedValue({ ...userToCreate, id: userToCreateId });
	
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: userToCreate.email } });
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: userToCreate.forename } });
	
	const surnameInput = container.querySelector(".userSurnameInput");
	fireEvent.change(surnameInput, { target: { value: userToCreate.surname } });
	
	const passwordInputs = container.querySelectorAll("input[type=password]");
	passwordInputs.forEach(input => fireEvent.change(input, { target: { value: userToCreatePassword } }));
	
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(container.querySelector(".ChangePasswordFormLogicContainer")).toBeNull();
		expect(container.querySelector(".PasswordFormPartial")).toBeNull();
	});
	
});

test("UserDetailsFormLogicContainer will pass any load errors to the UserDetailsForm", () => {
	
	const errorMessage = "test error on loading";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.getLoadedUser = () => { throw new Error(errorMessage); };
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={false}
									backButtonHandler={dummyBackHandler} />);
	
	const detailsForm = container.querySelector(".UserDetailsForm");
	expect(detailsForm.textContent).toEqual(expect.stringContaining(errorMessage));
	
});

test("UserDetailsFormLogicContainer will pass any on-create save errors to the UserDetailsForm", async () => {
	
	const errorMessage = "test error on saving";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.createUser = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	
	const userToCreate = {
		email: "test@test.com",
		password: "test123",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: userToCreate.email } });
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: userToCreate.forename } });
	
	const surnameInput = container.querySelector(".userSurnameInput");
	fireEvent.change(surnameInput, { target: { value: userToCreate.surname } });
	
	const passwordInputs = container.querySelectorAll("input[type=password]");
	passwordInputs.forEach(input => fireEvent.change(input, { target: { value: userToCreate.password } }));
	
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	
	
	await waitFor(() => {
		const detailsForm = container.querySelector(".UserDetailsForm");
		expect(detailsForm.textContent).toEqual(expect.stringContaining(errorMessage));
	});
	
});

test("UserDetailsFormLogicContainer will pass any on-update save errors to the UserDetailsForm", async () => {
	
	const errorMessage = "test error on updating";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.updateLoadedUser = jest.fn().mockRejectedValue(new Error(errorMessage));
	
	
	const userToCreate = {
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={false}
									backButtonHandler={dummyBackHandler} />);
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: "newValue" } });
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	
	
	await waitFor(() => {
		const detailsForm = container.querySelector(".UserDetailsForm");
		expect(detailsForm.textContent).toEqual(expect.stringContaining(errorMessage));
	});
	
});


test("UserDetailsFormLogicContainer will disable submit on UserDetailsForm, when creating, then re-enable", async () => {
	
	const userToCreate = {
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	//The below 2 are not included in the above object, as will only be there at different times
	const userToCreateId = "jashashsdh";
	const userToCreatePassword = "testpass";
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.createUser = jest.fn().mockResolvedValue({ ...userToCreate, id: userToCreateId });
	
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={dummyBackHandler} />);
	
	
	const submitButton = container.querySelector(".UserDetailsForm input[type=submit]");
	
	expect(submitButton).not.toBeDisabled(); //Is this not disabled
	
	//Create the user
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: userToCreate.email } });
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: userToCreate.forename } });
	
	const surnameInput = container.querySelector(".userSurnameInput");
	fireEvent.change(surnameInput, { target: { value: userToCreate.surname } });
	
	const passwordInputs = container.querySelectorAll("input[type=password]");
	passwordInputs.forEach(input => fireEvent.change(input, { target: { value: userToCreatePassword } }));
	
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	
	await waitFor(() => expect(submitButton).toBeDisabled()); //Is this disabled
	
	await waitFor(() => expect(submitButton).not.toBeDisabled()); //Is this re-enabled
	
});

test("UserDetailsFormLogicContainer will disable submit on UserDetailsForm, when updating, then re-enable", async () => {
	
	const userToLoad = {
		id: "dkjhashsdakjsh",
		email: "test@test.com",
		forename: "test",
		surname: "testing",
		scales: []
	};
	
	let mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	mockUserService.getLoadedUser = () => userToLoad;
	mockUserService.updateLoadedUser = jest.fn().mockResolvedValue(userToLoad);
	
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={false}
									backButtonHandler={dummyBackHandler} />);
	
	
	const submitButton = container.querySelector(".UserDetailsForm input[type=submit]");
	
	expect(submitButton).not.toBeDisabled(); //Is this not disabled
	
	
	const forenameInput = container.querySelector(".userForenameInput");
	fireEvent.change(forenameInput, { target: { value: "newValue" } });
	
	//Submit form
	const form = container.querySelector(".UserDetailsForm form");
	fireEvent.submit(form);
	
	
	await waitFor(() => expect(submitButton).toBeDisabled()); //Is this disabled
	
	await waitFor(() => expect(submitButton).not.toBeDisabled()); //Is this re-enabled
	
});


test("UserDetailsFormLogicContainer will pass the backButtonHandler down to UserDetailsForm", () => {
	
	const mockBackHandler = jest.fn();
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = () => {};
	
	const { container } = render(<UserDetailsFormLogicContainer
									userService={mockUserService}
									isNewUser={true}
									backButtonHandler={mockBackHandler} />);
	
	const backButton = container.querySelector(".UserDetailsForm .userDetailsBackButton");
	
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
	
});


test("ScaleDetailsFormLogicContainer will call userService abortRequests method on unmount", () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.abortRequests = jest.fn();
	
	const { container, unmount } = render(<UserDetailsFormLogicContainer
		userService={mockUserService}
		isNewUser={true}
		backButtonHandler={dummyBackHandler} />);
	
	
	unmount();
	
	expect(mockUserService.abortRequests).toHaveBeenCalled();
	
});