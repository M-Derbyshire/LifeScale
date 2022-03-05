import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
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





/*
	Wrapper component that controls the business logic for the ChangePasswordForm component.
	See the ChangePasswordForm component for more description.
*/
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
	
	
	componentWillUnmount()
	{
		this.props.userService.abortRequests();
	}
	
	
	
	handleSubmit()
	{
		//If not, ChangePasswordForm currently displays a message to say it's incorrect
		if(this.state.newPasswordIsConfirmed)
		{
			const goodSaveMessage = "Your password has now been changed.";
			
			this.props.userService
				.updateLoadedUserPassword(this.state.currentPassword, this.state.newPassword)
				.then((user:IUser) => this.setState({ goodSaveMessage, badSaveErrorMessage: undefined }))
				.catch(err => this.setState({ badSaveErrorMessage: err.message, goodSaveMessage: undefined }));
		}
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