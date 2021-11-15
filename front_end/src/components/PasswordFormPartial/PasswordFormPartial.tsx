import React, { Component } from 'react';

type PasswordFormPartialProps = {
	password:string;
	setPassword:(password:string)=>void;
	setPasswordIsConfirmed:(isconfirmed:boolean)=>void;
};

type PasswordFormPartialState = {
	confirmedPassword:string;
};

/*
	This is a form partial for password setting/resetting.
	
	If the password and confirmation password don't match, it will run the setPasswordIsConfirmed prop with a value of false. Otherwise,
	a value of true
	
	This will display a BadSaveMessage if the passwords don't match
*/
export default class PasswordFormPartial extends Component<PasswordFormPartialProps, PasswordFormPartialState> {
	
	constructor(props:PasswordFormPartialProps)
	{
		super(props);
		
		this.state = {
			confirmedPassword: ""
		};
	}
	
	
	render()
	{
		const passwordElemId = "passwordFormPassword";
		const confirmElemId = "passwordFormConfirm";
		
		return (
			<div className="PasswordFormPartial">
				
				<label htmlFor={passwordElemId}>Password: </label>
				<input id={passwordElemId} className="passwordInput" type="password" value={this.props.password} />
				<br/>
				<label htmlFor={confirmElemId}>Confirm Password: </label>
				<input id={confirmElemId} className="confirmPasswordInput" type="text" value={this.state.confirmedPassword} onChange={(e) => this.setState({ 
					confirmedPassword: e.target.value
				})} />
				
			</div>
		);
	}
	
}