import React, { Component } from 'react';
import './CreateUserForm.scss';
import IUser from '../../interfaces/IUser';


interface ICreateUserFormProps {
	user:IUser;
	setUser:(user:IUser)=>void;
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
	
	
	
	render()
	{
		
		return (
			<div className="CreateUserForm">
				
				<h1>Create New User</h1>
				
			</div>
		);
	}
	
}