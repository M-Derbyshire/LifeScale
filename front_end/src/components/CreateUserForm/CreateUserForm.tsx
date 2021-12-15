import React, { Component } from 'react';
import './CreateUserForm.scss';
import IUser from '../../interfaces/IUser';
import UserDetailsFormPartial from '../UserDetailsFormPartial/UserDetailsFormPartial';
import PasswordFormPartial from '../PasswordFormPartial/PasswordFormPartial';


interface ICreateUserFormProps {
	user:IUser;
	setUser:(user:IUser)=>void;
	passwordIsConfirmed:boolean;
	setPasswordIsConfirmed:(isConfirmed:boolean)=>void;
	onSubmit:()=>void;
}


/*
	This is used to create a new user in the system. The container should provide an IUser, with blank or 
	default data (the ID can be whatever the container decides -- probably a blank string).
	
	If the password entered here is not confirmed, then the IUser will have a blank string as a password.
	
	(This was originally a more complex component, with a state interface. So, now it's simpler, maybe 
	turn into a functional component in the future)
*/
export default class CreateUserForm extends Component<ICreateUserFormProps> {
	
	
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
						setEmail={(newEmail) => this.props.setUser({ ...this.props.user, email: newEmail})}
						setForename={(newForename) => this.props.setUser({ ...this.props.user, forename: newForename})}
						setSurname={(newSurname) => this.props.setUser({ ...this.props.user, surname: newSurname})} />
					
					<PasswordFormPartial 
						password={this.props.user.password} 
						setPassword={(newPassword) => this.props.setUser({ ...this.props.user, password: newPassword})}
						setPasswordIsConfirmed={this.props.setPasswordIsConfirmed} />
					
					<input type="submit" value="Register" />
					
				</form>
				
			</div>
		);
	}
	
}