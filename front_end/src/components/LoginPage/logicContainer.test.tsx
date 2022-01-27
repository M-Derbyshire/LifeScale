import LoginPageLogicContainer from './LoginPageLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';

const dummyOnLogin = () => {};

test("Logic container for LoginPage will render a LoginPage component", () => {
	
	const { container } = render(<Router>
									<LoginPageLogicContainer 
										userService={new TestingDummyUserService()}
										onSuccessfulLogin={dummyOnLogin}
										registerPath="/"
										forgotPasswordPath="/" />
								</Router> );
	
	expect(container.querySelector(".LoginPage")).not.toBeNull();
	
});


test("Logic container for LoginPage will handle the state and submission of form data", () => {
	
	const expectedEmailValue = "test1@test1.com";
	const expectedPasswordValue = "test123";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.loginUser = jest.fn().mockResolvedValue({
		id: "test",
		email: expectedEmailValue,
		forename: "test",
		surname: "tester",
		scales: []
	});
	
	const { container } = render(<Router>
									<LoginPageLogicContainer 
										userService={mockUserService}
										onSuccessfulLogin={dummyOnLogin}
										registerPath="/"
										forgotPasswordPath="/" />
								</Router>);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: expectedEmailValue } });
	
	const passwordInput = container.querySelector("input[type=password]");
	fireEvent.change(passwordInput, { target: { value: expectedPasswordValue } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockUserService.loginUser).toHaveBeenCalledWith(expectedEmailValue, expectedPasswordValue);
	
});


test("Logic container for LoginPage will pass the bad login error message to the LoginPage", async () => {
	
	const message = "Test error message 123";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.loginUser = jest.fn().mockRejectedValue(new Error(message));
	
	const { container } = render(<Router>
									<LoginPageLogicContainer 
										userService={mockUserService}
										onSuccessfulLogin={dummyOnLogin}
										registerPath="/"
										forgotPasswordPath="/" />
								</Router>);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	const passwordInput = container.querySelector("input[type=password]");
	fireEvent.change(passwordInput, { target: { value: "Password1234" } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(
		() => expect(screen.getByText(message)).not.toBeNull()
	);
	
});



test("Logic container for LoginPage will pass the link paths to the LoginPage", () => {
	
	const registerPath = "/testregister";
	const forgotPath = "/testforgot";
	
	const { container } = render(<Router>
									<LoginPageLogicContainer 
										userService={new TestingDummyUserService()}
										onSuccessfulLogin={dummyOnLogin}
										registerPath={registerPath}
										forgotPasswordPath={forgotPath} />
								</Router>);
	
	const registerLink = screen.getByText("register", {exact: false});
	expect(registerLink).toHaveAttribute("href", registerPath);
	
	const forgotLink = screen.getByText("forgot", {exact: false});
	expect(forgotLink).toHaveAttribute("href", forgotPath);
	
});


test("Logic container for LoginPage will call the onSuccesfulLogin prop on good login", async () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.loginUser = jest.fn().mockResolvedValue({
		id: "test",
		email: "test@test.com",
		forename: "test",
		surname: "tester",
		scales: []
	});
	
	const mockOnLogin = jest.fn();
	
	const { container } = render(<Router>
									<LoginPageLogicContainer 
										userService={mockUserService}
										onSuccessfulLogin={mockOnLogin}
										registerPath="/"
										forgotPasswordPath="/" />
								</Router>);
	
	const emailInput = container.querySelector("input[type=email]");
	fireEvent.change(emailInput, { target: { value: "test@test.com" } });
	
	const passwordInput = container.querySelector("input[type=password]");
	fireEvent.change(passwordInput, { target: { value: "password" } });
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => expect(mockOnLogin).toHaveBeenCalled());
	
});