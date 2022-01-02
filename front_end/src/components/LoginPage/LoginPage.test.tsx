import LoginPage from './LoginPage';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

const dummySetState = (x)=>{};

test("LoginPage will render a LoginForm", () => {
	
	const { container } = render(<Router>
									<LoginPage 
										email="email@email.com"
										password="test"
										setEmail={dummySetState}
										setPassword={dummySetState}
										loginHandler={()=>{}}
										registerUserLinkPath={"/test"}
										forgotPasswordLinkPath={"/test"} />
								</Router>);
	
	const loginForm = container.querySelector(".LoginForm");
	
	expect(loginForm).not.toBeNull();
	
});

test.each([
	["/test1"],
	["/test2"]
])("LoginPage will render a link to go to the register route with the given register path prop", (testPath) => {
	
	render(<Router>
			<LoginPage 
				email="email@email.com"
				password="test"
				setEmail={dummySetState}
				setPassword={dummySetState}
				loginHandler={()=>{}}
				registerUserLinkPath={testPath}
				forgotPasswordLinkPath={"/test"} />
			</Router>);
	
	const registerLink = screen.getByText("register", {exact: false});
	
	expect(registerLink).toHaveAttribute("href", testPath);
	
});

test.each([
	["/test1"],
	["/test2"]
])("LoginPage will render a link to go to the forgot password route with the given path prop", (testPath) => {
	
	render(<Router>
			<LoginPage 
				email="email@email.com"
				password="test"
				setEmail={dummySetState}
				setPassword={dummySetState}
				loginHandler={()=>{}}
				registerUserLinkPath={"/test"}
				forgotPasswordLinkPath={testPath} />
			</Router>);
	
	const forgotLink = screen.getByText("forgot", {exact: false});
	
	expect(forgotLink).toHaveAttribute("href", testPath);
	
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