import React, { Component, ReactElement } from 'react';
import UserDetailsForm from './UserDetailsForm';
import PasswordFormPartial from './PasswordFormPartial/PasswordFormPartial';
import ChangePasswordFormLogicContainer from './ChangePasswordForm/ChangePasswordFormLogicContainer';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';


interface IUserDetailsFormLogicContainerProps {
	userService:IUserService;
	isNewUser:boolean;
	backButtonHandler:()=>void;
}

interface IUserDetailsFormLogicContainerState {
	user?:IUser|Omit<IUser, "id"> & { password:string };
	passwordIsConfirmed:boolean; // Does the new password field match the password confirmation field?
	userSavedPreviously:boolean; //Have any saves been completed (during this use), even if this is a new user
	badLoadErrorMessage?:string;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
	disableSubmit:boolean;
}




/*
	Wrapper component that controls the business logic for the UserDetailsForm component.
	See the UserDetailsForm component for more description.
*/
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
			passwordIsConfirmed: false,
			userSavedPreviously: false,
			badLoadErrorMessage,
			badSaveErrorMessage: undefined,
			goodSaveMessage: undefined,
			disableSubmit: false
		};
		
	}
	
	
	componentWillUnmount()
	{
		this.props.userService.abortRequests();
	}
	
	
	
	
	
	
	onSubmit(isCreatingUser:boolean)
	{
		this.setState({ disableSubmit: true });
		
		
		const onGoodSaveNewState = {
			user: undefined,
			userSavedPreviously: true,
			badSaveErrorMessage: undefined,
			goodSaveMessage: "The user details have now been saved.",
			disableSubmit: false
		};
		
		const onBadSaveNewState = {
			goodSaveMessage: undefined,
			disableSubmit: false
		};
		
		
		if(isCreatingUser)
		{
			if("password" in this.state.user! && this.state.passwordIsConfirmed)
			{
				const correctlyTypedUserData:Omit<IUser, "id"> & { password:string } = {
					email: this.state.user!.email,
					password: this.state.user!.password,
					forename: this.state.user!.forename,
					surname: this.state.user!.surname,
					scales: this.state.user!.scales
				};
				
				this.props.userService.createUser(correctlyTypedUserData)
					.then(user => this.setState({ ...onGoodSaveNewState, user }))
					.catch(err => this.setState({ ...onBadSaveNewState, badSaveErrorMessage: err.message }));
			}
			else
			{
				this.setState({ 
					...onBadSaveNewState, 
					badSaveErrorMessage: "The password confirmation does not match the given password." 
				});
			}
		}
		else
		{
			if("id" in this.state.user!)
			{
				const correctlyTypedUserData:IUser = {
					id: this.state.user!.id,
					email: this.state.user!.email,
					forename: this.state.user!.forename,
					surname: this.state.user!.surname,
					scales: this.state.user!.scales
				};
				
				this.props.userService.updateLoadedUser(correctlyTypedUserData)
					.then(user => this.setState({ ...onGoodSaveNewState, user }))
					.catch(err => this.setState({ ...onBadSaveNewState, badSaveErrorMessage: err.message }));
			}
		}
	}
	
	
	
	
	
	
	render()
	{
		const isCreatingUser = (this.props.isNewUser && !this.state.userSavedPreviously);
		
		
		
		let passwordForm:ReactElement|undefined = undefined; //undefined if editing user that is not logged in
		if(isCreatingUser)
		{
			passwordForm = (<PasswordFormPartial 
								password={("password" in this.state.user!) ? this.state.user!.password : ""}
								setPassword={(password) => this.setState({
									 user: { ...this.state.user!, password } 
								})}
								setPasswordIsConfirmed={(isConfirmed:boolean) => this.setState({
									passwordIsConfirmed: isConfirmed
								})} />);
		}
		else if (!this.props.isNewUser)
		{
			passwordForm = (<ChangePasswordFormLogicContainer userService={this.props.userService} />);
		}
		
		
		
		
		
		const correctlyTypedUserData:IUser = {
			id: ("id" in this.state.user!) ? this.state.user!.id : "",
			email: this.state.user!.email,
			forename: this.state.user!.forename,
			surname: this.state.user!.surname,
			scales: this.state.user!.scales
		};
		
		
		
		
		return (
			<div className="UserDetailsFormLogicContainer">
				<UserDetailsForm 
					user={correctlyTypedUserData}
					setUser={(newUserDetails) => this.setState({ user: newUserDetails })}
					headingText={(isCreatingUser) ? "Register" : "Update User Details"}
					badLoadErrorMessage={this.state.badLoadErrorMessage}
					passwordForm={passwordForm}
					backButtonHandler={this.props.backButtonHandler}
					onSubmit={() => this.onSubmit(isCreatingUser)}
					disableSubmit={this.state.disableSubmit}
					submitButtonText={(isCreatingUser) ? "Register" : "Save"}
					badSaveErrorMessage={this.state.badSaveErrorMessage}
					goodSaveMessage={this.state.goodSaveMessage} />
			</div>
		);
	}
	
}