import React, { FC } from 'react';

interface IRequestPasswordFormProps {
	email:string;
	setEmail:(email:string)=>void;
}

const RequestPasswordForm:FC<IRequestPasswordFormProps> = (props) => {
	
	const emailElemId = "emailForPasswordReset";
	
	return (
		<div className="RequestPasswordForm">
			<form>
				<label htmlFor={emailElemId}>Email: </label>
				<input type="email"></input>
			</form>
		</div>
	);
	
};

export default RequestPasswordForm;