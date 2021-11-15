import React, { FC } from 'react';

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
			<form onSubmit={props.onSubmit}>
				<label htmlFor={emailElemId}>Email: </label>
				<input type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				
				<input type="submit" value="Request Password" />
			</form>
		</div>
	);
	
};

export default RequestPasswordForm;