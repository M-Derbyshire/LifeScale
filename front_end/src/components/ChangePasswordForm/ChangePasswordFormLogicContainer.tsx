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
	
	handleSubmit()
	{
		this.props.userService.updateLoadedUserPassword(
			this.state.currentPassword, 
			this.state.newPassword
		);
	}
	
	render()
	{
		return (
			<div className="ChangePasswordFormLogicContainer">
				<ChangePasswordForm 
					currentPassword={this.state.currentPassword}
					setCurrentPassword={(currentPassword:string) => this.setState({ currentPassword })}
					newPassword={this.state.newPassword}
					setNewPassword={(newPassword:string) => this.setState({ newPassword })}
					setNewPasswordIsConfirmed={
						(newPasswordIsConfirmed:boolean) => this.setState({ newPasswordIsConfirmed })
					}
					onSubmit={this.handleSubmit.bind(this)}
					badSaveErrorMessage={this.state.badSaveErrorMessage}
					goodSaveMessage={this.state.goodSaveMessage} />
			</div>
		);
	}
	
}