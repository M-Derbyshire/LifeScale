import React, { FC } from 'react';
import './RequestPasswordForm.scss';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';

interface IRequestPasswordFormProps {
	email:string;
	setEmail:(email:string)=>void;
	onSubmit:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
	backButtonHandler:()=>void;
}

/*
	Display layer component to display a form for users to request a new password.
	See RequestPasswordPage and RequestPasswordPageLogicContainer components for the logic to do this.
*/
const RequestPasswordForm:FC<IRequestPasswordFormProps> = (props) => {
	
	return (
		<div className="RequestPasswordForm">
			
			<h1>Request New Password</h1>
			
			<form onSubmit={(e) => { e.preventDefault(); props.onSubmit(); }}>
				<label>
					Email: <input 
								type="email"
								data-test="requestPasswordEmailInput" 
								required 
								value={props.email}
								onChange={(e)=>props.setEmail(e.target.value)} />
				</label>
				<br />
				
				{props.badSaveErrorMessage && 
							<BadSaveMessage message={props.badSaveErrorMessage} />}
				{props.goodSaveMessage && 
							<GoodSaveMessage message={props.goodSaveMessage} />}
				
				
				<input type="submit" data-test="requestPasswordBtn" value="Request New Password" />
				<button className="backButton" data-test="requestPasswordBackBtn" type="button" onClick={props.backButtonHandler}>
					Back to Login
				</button>
			</form>
		</div>
	);
	
};

export default RequestPasswordForm;