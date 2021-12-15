import React, { Component } from 'react';
import './CreateUserForm.scss';
import IUser from '../../interfaces/IUser';
import UserDetailsFormPartial from '../UserDetailsFormPartial/UserDetailsFormPartial';


interface ICreateUserFormProps {
	user:IUser;
	setUser:(user:IUser)=>void;
	onSubmit:()=>void;
}

interface ICreateUserFormState {
	enteredPassword:string; //This may not be confirmed
	passwordIsConfirmed:boolean;
}


/*
	This is used to create a new user in the system. The container should provide an IUser, with blank or 
	default data (the ID can be whatever the container decides -- probably a blank string).
	
	If the password entered here is not confirmed, then the IUser will have a blank string as a password.
*/
export default class CreateUserForm extends Component<ICreateUserFormProps, ICreateUserFormState> {
	
	
	//This will handle the changing of the user state (Such as deciding what to set as 
	//the password, based on whether or not it's been confirmed)
	setUserState(newUser:IUser)
	{
		
		this.props.setUser(newUser);
	}
	
	
	render()
	{
		
		return (
			<div className="CreateUserForm">
				
				<header>
					<h1>Create New User</h1>
				</header>
				
				<form onSubmit={this.props.onSubmit}>
					
					<UserDetailsFormPartial 
						email={this.props.user.email}
						forename={this.props.user.forename}
						surname={this.props.user.surname}
						setEmail={(newEmail) => this.setUserState({ ...this.props.user, email: newEmail})}
						setForename={(newForename) => this.setUserState({ ...this.props.user, forename: newForename})}
						setSurname={(newSurname) => this.setUserState({ ...this.props.user, surname: newSurname})} />
					
					<input type="submit" value="Register" />
					
				</form>
				
			</div>
		);
	}
	
}