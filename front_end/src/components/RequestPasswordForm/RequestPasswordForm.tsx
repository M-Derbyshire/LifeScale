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
}

/*
	Display layer component to display a form for users to request a new password
*/
const RequestPasswordForm:FC<IRequestPasswordFormProps> = (props) => {
	
	return (
		<div className="RequestPasswordForm">
			
			<h1>Request New Password</h1>
			
			<form onSubmit={(e) => { e.preventDefault(); props.onSubmit(); }}>
				<label>
					Email: <input type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				</label>
				<br />
				
				{props.badSaveErrorMessage && 
							<BadSaveMessage message={props.badSaveErrorMessage} />}
				{props.goodSaveMessage && 
							<GoodSaveMessage message={props.goodSaveMessage} />}
				
				<input type="submit" value="Request New Password" />
			</form>
		</div>
	);
	
};

export default RequestPasswordForm;