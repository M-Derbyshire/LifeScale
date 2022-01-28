import React, { Component } from 'react';
import UserDetailsForm from './UserDetailsForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';


interface IUserDetailsFormLogicContainerProps {
	userService:IUserService;
	isNewUser:boolean;
	backButtonHandler:()=>void;
}

interface IUserDetailsFormLogicContainerState {
	user?:IUser|Omit<IUser, "id"> & { password:string };
	userSavedPreviously:boolean; //Have any saves been completed (during this use), even if this is a new user
	badLoadErrorMessage?:string;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}



export default class UserDetailsFormLogicContainer 
	extends Component<IUserDetailsFormLogicContainerProps, IUserDetailsFormLogicContainerState> 
{
	
	constructor(props:IUserDetailsFormLogicContainerProps)
	{
		super(props);
		
		//The state will start different, depending on if we're creating or editing
		
		let user:IUser|Omit<IUser, "id"> & { password:string } = {
			email: "",
			password: "",
			forename: "",
			surname: "",
			scales: []
		};
		
		let badLoadErrorMessage:string|undefined = undefined;
		
		try 
		{
			if(!this.props.isNewUser)
				user = this.props.userService.getLoadedUser();
		} 
		catch (err:any) 
		{
			if(err.message)
				badLoadErrorMessage = `Unable to load the current user's data: ${err.message}`;
		}
		
		
		this.state = {
			user,
			userSavedPreviously: false,
			badLoadErrorMessage,
			badSaveErrorMessage: undefined,
			goodSaveMessage: undefined
		};
		
	}
	
	
	render()
	{
		const isCreatingUser = (this.props.isNewUser && this.state.userSavedPreviously);
		const rejectAccess = (!isCreatingUser && !this.props.userService.isLoggedIn());
		
		return (
			<div className="UserDetailsFormLogicContainer">
				
			</div>
		);
	}
	
}