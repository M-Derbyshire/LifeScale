import React, { Component } from 'react';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

type PasswordFormPartialProps = {
	password:string;
	setPassword:(password:string)=>void;
	setPasswordIsConfirmed:(isconfirmed:boolean)=>void;
	passwordLabel?:string;
};

type PasswordFormPartialState = {
	confirmedPassword:string;
};

/*
	This is a form partial for password setting/resetting.
	
	If the password and confirmation password don't match, it will run the setPasswordIsConfirmed prop with a value of false. Otherwise,
	a value of true
	
	This will display a BadSaveMessage if the passwords don't match
	
	The passwordLabel prop will determine what the form labels say (maybe you want it to say "New Password", instead of just "Password"). The confirmation label
	will always start with "Confirm". The default passwordLabel is "Password"
*/
export default class PasswordFormPartial extends Component<PasswordFormPartialProps, PasswordFormPartialState> {
	
	constructor(props:PasswordFormPartialProps)
	{
		super(props);
		
		this.state = {
			confirmedPassword: ""
		};
	}
	
	
	
	handleSetPassword(password:string)
	{
		this.props.setPassword(password);
		this.props.setPasswordIsConfirmed(password === this.state.confirmedPassword);
	}
	
	handleSetConfirmedPassword(password:string)
	{
		this.setState({ confirmedPassword: password });
		this.props.setPasswordIsConfirmed(password === this.props.password);
	}
	
	
	
	
	render()
	{
		const passwordMismatchMessage = "The password confirmation must match the given password.";
		
		const labelText = (this.props.passwordLabel && this.props.passwordLabel !== "") ? this.props.passwordLabel : "Password";
		
		return (
			<div className="PasswordFormPartial">
				
				<label className="passwordInputLabel">
					{labelText}: <input className="passwordInput" type="password" value={this.props.password} onChange={(e) => this.handleSetPassword(e.target.value)} />
				</label>
				<br/>
				
				<label className="confirmPasswordInputLabel">
					Confirm {labelText}: <input className="confirmPasswordInput" type="password" value={this.state.confirmedPassword} 
											onChange={(e) => this.handleSetConfirmedPassword(e.target.value)} />
				</label>
				
				{(this.props.password !== this.state.confirmedPassword) && <BadSaveMessage message={passwordMismatchMessage} />}
			</div>
		);
	}
	
}