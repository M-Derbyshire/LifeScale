import React, { FC } from 'react';
import './ChangePasswordForm.scss';
import PasswordFormPartial from '../PasswordFormPartial/PasswordFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

interface IChangePasswordFormProps {
	currentPassword:string;
	setCurrentPassword:(password:string)=>void;
	newPassword:string;
	setNewPassword:(password:string)=>void;
	setNewPasswordIsConfirmed:(confirmed:boolean)=>void
	
	onSubmit:()=>void;
	badSaveErrorMessage?:string;
}

/*
	Used to allow a user to change their password (and uses a boolean prop to set if the 
	new password has been confirmed)
*/
const ChangePasswordForm:FC<IChangePasswordFormProps> = (props) => {
	
	return (
		<div className="ChangePasswordForm">
		
			<label className="currentPasswordInputLabel">
				Current Password: <input className="currentPasswordInput" 
									type="password"
									value={props.currentPassword} 
									onChange={(e) => props.setCurrentPassword(e.target.value)} />
			</label>
			
			<PasswordFormPartial
				password={props.newPassword}
				setPassword={props.setNewPassword}
				setPasswordIsConfirmed={props.setNewPasswordIsConfirmed}
				passwordLabel="New Password" />
			
			{props.badSaveErrorMessage && 
							<BadSaveMessage message={props.badSaveErrorMessage} />}
			
			<button type="button" onClick={props.onSubmit}>Change Password</button>
			
		</div>
	);
	
};


export default ChangePasswordForm;