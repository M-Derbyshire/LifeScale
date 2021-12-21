import React, { FC } from 'react';
import './ChangePasswordForm.scss';

interface IChangePasswordFormProps {
	currentPassword:string;
	setCurrentPassword:(password:string)=>void;
	newPassword:string;
	setNewPassword:(password:string)=>void;
	newPasswordIsConfirmed:boolean;
	setNewPasswordIsConfirmed:(confirmed:boolean)=>void
	
	onSubmit:()=>void;
}

/*
	Used to allow a user to change their password (and uses a boolean prop to set if the 
	new password has been confirmed)
*/
const ChangePasswordForm:FC<IChangePasswordFormProps> = (props) => {
	
	return (
		<div className="ChangePasswordForm">
			
		</div>
	);
	
};


export default ChangePasswordForm;