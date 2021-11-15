import React, { Component } from 'react';

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
		const passwordElemId = "passwordFormPassword";
		const confirmElemId = "passwordFormConfirm";
		
		const labelText = (this.props.passwordLabel && this.props.passwordLabel !== "") ? this.props.passwordLabel : "Password";
		
		return (
			<div className="PasswordFormPartial">
				
				<label htmlFor={passwordElemId}>{labelText}: </label>
				<input id={passwordElemId} className="passwordInput" type="password" value={this.props.password} onChange={(e) => this.handleSetPassword(e.target.value)} />
				<br/>
				<label htmlFor={confirmElemId}>Confirm {labelText}: </label>
				<input id={confirmElemId} className="confirmPasswordInput" type="password" value={this.state.confirmedPassword} 
					onChange={(e) => this.handleSetConfirmedPassword(e.target.value)} />
				
			</div>
		);
	}
	
}