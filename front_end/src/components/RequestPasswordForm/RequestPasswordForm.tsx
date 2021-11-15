import React, { FC } from 'react';
import './RequestPasswordForm.scss';

interface IRequestPasswordFormProps {
	email:string;
	setEmail:(email:string)=>void;
	onSubmit:()=>void;
}

/*
	Display layer component to display a form for users to request a new password
*/
const RequestPasswordForm:FC<IRequestPasswordFormProps> = (props) => {
	
	const emailElemId = "emailForPasswordReset";
	
	return (
		<div className="RequestPasswordForm">
			
			<h1>Request New Password</h1>
			
			<form onSubmit={props.onSubmit}>
				<label htmlFor={emailElemId}>Email: </label>
				<input type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				<br />
				<input type="submit" value="Request New Password" />
			</form>
		</div>
	);
	
};

export default RequestPasswordForm;