import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.scss';
import LoginForm from '../LoginForm/LoginForm';

interface ILoginPageProps {
	email:string;
	setEmail:(username:string)=>void;
	password:string;
	setPassword:(password:string)=>void;
	
	loginHandler:()=>void;
	badLoginErrorMessage?:string;
	
	registerUserLinkPath:string; //The url path for the user registration route (should start with a forward-slash)
	forgotPasswordLinkPath:string; //The url path for the forgotten password route (should start with a forward-slash)
}

/*
	Used to login to the application (also to provide links to register an account, and for 
	when users forget their passwords)
*/
const LoginPage:FC<ILoginPageProps> = (props) => {
	
	return (
		<div className="LoginPage">
			<div className="loginPageContentContainer">
				<LoginForm 
					email={props.email} 
					setEmail={props.setEmail} 
					password={props.password} 
					setPassword={props.setPassword}
					onSubmit={props.loginHandler}
					badLoginErrorMessage={props.badLoginErrorMessage} />
				
				<div className="LoginPageLinksContainer">
					<Link to={props.registerUserLinkPath}>Register</Link>
					<Link to={props.forgotPasswordLinkPath}>Forgot Password</Link>
				</div>
			</div>
		</div>
	);
	
};

export default LoginPage;