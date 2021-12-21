import React, { FC } from 'react';
import './ChangePasswordFormPartial.scss';

interface IChangePasswordFormPartialProps {
	currentPassword:string;
	setCurrentPassword:(password:string)=>void;
	newPassword:string;
	setNewPassword:(password:string)=>void;
	newPasswordIsConfirmed:boolean;
	setNewPasswordIsConfirmed:(confirmed:boolean)=>void
}

/*
	Used to allow a user to change their password (and uses a boolean prop to set if the 
	new password has been confirmed)
*/
const ChangePasswordFormPartial:FC<IChangePasswordFormPartialProps> = (props) => {
	
	return (
		<div className="ChangePasswordFormPartial">
				
			<label className="currentPasswordInputLabel">
				Current Password: <input 
									className="newPasswordInput" 
									type="password"
									value={props.currentPassword}
									onChange={(e) => props.setCurrentPassword(e.target.value)} />
			</label>
			
			
			
		</div>
	);
	
};


export default ChangePasswordFormPartial;