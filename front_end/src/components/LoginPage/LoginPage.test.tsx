import LoginPage from './LoginPage';
import { render, fireEvent } from '@testing-library/react';

const dummySetState = (x)=>{};

test("LoginPage will render a LoginForm", () => {
	
	const { container } = render(<LoginPage 
									email="email@email.com"
									password="test"
									setEmail={dummySetState}
									setPassword={dummySetState}
									loginHandler={()=>{}}
									registerUserLinkPath={"/test"}
									forgotPasswordLinkPath={"/test"} />);
	
	const loginForm = container.querySelector(".LoginForm");
	
	expect(loginForm).not.toBeNull();
	
});