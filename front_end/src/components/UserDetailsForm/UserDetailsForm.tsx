import React, { Component } from 'react';
import './UserDetailsForm.scss';
import IUser from '../../interfaces/IUser';
import UserDetailsFormPartial from '../UserDetailsFormPartial/UserDetailsFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';


interface IUserDetailsFormProps {
	user:IUser;
	setUser:(user:IUser)=>void;
	
	headingText:string;
	
	onSubmit:()=>void;
	disableSubmit?:boolean;
	submitButtonText:string;
	badSaveErrorMessage?:string;
}


/*
	This is used to create and edit users in the system. The container should provide an IUser, with blank or 
	default data (the ID can be whatever the container decides -- probably a blank string).
	
	The container can also enter a password form to be rendered (will differ depending on if it's a creation, or
	password change)
	
	(This was originally a more complex component, with a state interface. So, now it's simpler, maybe 
	turn into a functional component in the future)
*/
export default class UserDetailsForm extends Component<IUserDetailsFormProps> {
	
	
	render()
	{
		
		return (
			<div className="UserDetailsForm">
				
				<header>
					<h1>{this.props.headingText}</h1>
				</header>
				
				<form onSubmit={this.props.onSubmit}>
					
					<UserDetailsFormPartial 
						email={this.props.user.email}
						forename={this.props.user.forename}
						surname={this.props.user.surname}
						setEmail={(newEmail) => this.props.setUser({ ...this.props.user, email: newEmail})}
						setForename={(newForename) => this.props.setUser({ ...this.props.user, forename: newForename})}
						setSurname={(newSurname) => this.props.setUser({ ...this.props.user, surname: newSurname})} />
					
					
					
					{this.props.badSaveErrorMessage && 
						<BadSaveMessage message={this.props.badSaveErrorMessage} />}
					
					<input type="submit" value={this.props.submitButtonText} disabled={this.props.disableSubmit} />
					
				</form>
				
			</div>
		);
	}
	
}