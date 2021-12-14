import React, { FC } from 'react';
import './LoginPage.scss';
import LoginForm from '../LoginForm/LoginForm';

interface ILoginPageProps {
	email:string;
	setEmail:(username:string)=>void;
	password:string;
	setPassword:(password:string)=>void;
	
	loginHandler:()=>void
	
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
			
			<LoginForm 
				email={props.email} 
				setEmail={props.setEmail} 
				password={props.password} 
				setPassword={props.setPassword}
				onSubmit={props.loginHandler} />
			
			
			
		</div>
	);
	
};

export default LoginPage;