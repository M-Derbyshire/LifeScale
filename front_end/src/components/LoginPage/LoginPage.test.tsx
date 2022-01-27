import LoginPage from './LoginPage';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

const dummySetState = (x)=>{};

test("LoginPage will render a LoginForm with the given props", () => {
	
	const initialEmailValue = "test@test.com";
	const newEmailValue = "test2@test.com";
	const initialPasswordValue = "test";
	const newPasswordValue = "test2";
	const mockSetEmail = jest.fn();
	const mockSetPassword = jest.fn();
	const mockLoginHandler = jest.fn();
	const registerPath = "/testRegister";
	const forgotPath = "/testNewPassword";
	
	const { container } = render(<Router>
									<LoginPage 
										email={initialEmailValue}
										password={initialPasswordValue}
										setEmail={mockSetEmail}
										setPassword={mockSetPassword}
										loginHandler={mockLoginHandler}
										registerUserLinkPath={registerPath}
										forgotPasswordLinkPath={forgotPath} />
								</Router>);
	
	const loginForm = container.querySelector(".LoginForm");
	expect(loginForm).not.toBeNull();
	
	const emailInput = screen.getByDisplayValue(initialEmailValue);
	fireEvent.change(emailInput, { target: { value: newEmailValue } });
	expect(mockSetEmail).toHaveBeenCalledWith(newEmailValue);
	
	const passwordInput = screen.getByDisplayValue(initialPasswordValue);
	fireEvent.change(passwordInput, { target: { value: newPasswordValue } });
	expect(mockSetPassword).toHaveBeenCalledWith(newPasswordValue);
	
	const form = container.querySelector(".LoginForm form");
	fireEvent.submit(form);
	expect(mockLoginHandler).toHaveBeenCalled();
	
	const registerLink = screen.getByText("register", {exact: false});
	expect(registerLink).toHaveAttribute("href", registerPath);
	
	const forgotLink = screen.getByText("forgot", {exact: false});
	expect(forgotLink).toHaveAttribute("href", forgotPath);
	
});



test.each([
	["test1-dhfsjdhfkjsdhf"],
	["test2-ewurteurywuriy"]
])("LoginPage will pass the bad login error message to the LoginForm", (message) => {
	
	const { container } = render(<Router>
			<LoginPage 
				email="email@email.com"
				password="test"
				setEmail={dummySetState}
				setPassword={dummySetState}
				loginHandler={()=>{}}
				registerUserLinkPath={"/test"}
				forgotPasswordLinkPath={"/test2"}
				badLoginErrorMessage={message} />
			</Router>);
	
	
	const loginForm = container.querySelector(".LoginForm");
	
	expect(loginForm.textContent).toEqual(expect.stringContaining(message));
	
});