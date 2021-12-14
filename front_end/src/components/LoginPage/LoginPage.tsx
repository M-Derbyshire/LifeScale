import React, { FC } from 'react';
import './LoginPage.scss';
import LoginForm from '../LoginForm/LoginForm';

interface ILoginPageProps {
	username:string;
	setUsername:(username:string)=>void;
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
			
		</div>
	);
	
};

export default LoginPage;