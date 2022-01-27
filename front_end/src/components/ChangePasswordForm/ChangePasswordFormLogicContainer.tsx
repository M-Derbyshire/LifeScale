import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import ChangePasswordForm from './ChangePasswordForm';

interface IChangePasswordFormLogicContainerProps {
	userService:IUserService
}

interface IChangePasswordFormLogicContainerState {
	currentPassword:string;
	newPassword:string;
	newPasswordIsConfirmed:boolean;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}


export default class ChangePasswordFormLogicContainer 
	extends Component<IChangePasswordFormLogicContainerProps, IChangePasswordFormLogicContainerState> 
{
	
	constructor(props:IChangePasswordFormLogicContainerProps)
	{
		super(props);
		
		this.state = {
			currentPassword: "",
			newPassword: "",
			newPasswordIsConfirmed: false,
			badSaveErrorMessage: undefined,
			goodSaveMessage: undefined
		};
	}
	
	render()
	{
		return (
			<div className="ChangePasswordFormLogicContainer">
				
			</div>
		);
	}
	
}