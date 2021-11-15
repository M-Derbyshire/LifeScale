import React, { FC } from 'react';
import './LoginForm.scss';

interface ILoginFormProps {
	email:string;
	setEmail:(email:string)=>void;
	password:string;
	setPassword:(password:string)=>void;
	onSubmit:()=>void;
}

/*
	Display layer component to display a form for users to request a new password
*/
const LoginForm:FC<ILoginFormProps> = (props) => {
	
	const emailElemId = "emailForLogin";
	const passwordElemId = "passwordForLogin";
	
	return (
		<div className="LoginForm">
			<form onSubmit={props.onSubmit}>
				
				<label htmlFor={emailElemId}>Email: </label>
				<input type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				<br/>
				<label htmlFor={passwordElemId}>Password: </label>
				<input type="password" value={props.password} onChange={(e)=>props.setPassword(e.target.value)} />
				
				<br />
				<input type="submit" value="Login" />
			</form>
		</div>
	);
	
};

export default LoginForm;