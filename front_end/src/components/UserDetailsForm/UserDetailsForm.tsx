import React, { Component, ReactElement } from 'react';
import './UserDetailsForm.scss';
import IUser from '../../interfaces/IUser';
import UserDetailsFormPartial from './UserDetailsFormPartial/UserDetailsFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';


interface IUserDetailsFormProps {
	user?:IUser;
	setUser:(user:IUser)=>void;
	
	headingText:string;
	badLoadErrorMessage?:string;
	passwordForm?:ReactElement; // The form used to set or change the user's password
	
	backButtonHandler:()=>void;
	
	onSubmit:()=>void;
	disableSubmit?:boolean;
	submitButtonText:string;
	
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}


/*
	This is used to create and edit users in the system. The logic container component should provide an IUser, with blank or 
	default data (the ID can be whatever the container decides -- probably a blank string).
	
	The container can also enter a password form to be rendered (could be a form for a new user's password, or a form for
	password changes)
	
	
	TODO: This was originally a more complex component, with a state interface. So, now it's simpler, maybe 
	turn into a functional component in the future
*/
export default class UserDetailsForm extends Component<IUserDetailsFormProps> {
	
	render()
	{
		
		return (
			<div className="UserDetailsForm">
				
				<header>
					<h1>{this.props.headingText}</h1>
					<button className="userDetailsBackButton" data-test="userDetailsBackButton" onClick={this.props.backButtonHandler}>Back</button>
				</header>
				
				<LoadedContentWrapper errorMessage={this.props.badLoadErrorMessage} render={this.props.user && 
					<form onSubmit={(e) => { e.preventDefault(); this.props.onSubmit() } }>
						
						<UserDetailsFormPartial 
							email={this.props.user.email}
							forename={this.props.user.forename}
							surname={this.props.user.surname}
							setEmail={(newEmail) => this.props.setUser({ ...this.props.user!, email: newEmail})}
							setForename={(newForename) => this.props.setUser({ ...this.props.user!, forename: newForename})}
							setSurname={(newSurname) => this.props.setUser({ ...this.props.user!, surname: newSurname})} />
						
						
						{/* We're checking explicitly before rendering the containing div (rather than just for the passwordForm), 
						to make sure styles aren't applied when the passwordForm isn't provided */}
						{this.props.passwordForm && <div className="passwordFormArea">
							{this.props.passwordForm}
						</div>}
						
						
						{this.props.badSaveErrorMessage && 
							<BadSaveMessage message={this.props.badSaveErrorMessage} />}
						{this.props.goodSaveMessage && 
							<GoodSaveMessage message={this.props.goodSaveMessage} />}
						
						<input type="submit" data-test="userDetailsSaveBtn" value={this.props.submitButtonText} disabled={this.props.disableSubmit} />
						
					</form>
				} />
				
			</div>
		);
	}
	
}