import React, { FC } from 'react';

interface IRequestPasswordFormProps {
	email:string;
	setEmail:(email:string)=>void;
	onSubmit:()=>void;
}

const RequestPasswordForm:FC<IRequestPasswordFormProps> = (props) => {
	
	const emailElemId = "emailForPasswordReset";
	
	return (
		<div className="RequestPasswordForm">
			<form onSubmit={props.onSubmit}>
				<label htmlFor={emailElemId}>Email: </label>
				<input type="email" value={props.email} />
				
				<input type="submit" value="Request Password" />
			</form>
		</div>
	);
	
};

export default RequestPasswordForm;