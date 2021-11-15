import React, { Component } from 'react';

type PasswordFormPartialProps = {
	password:string;
	setPassword:(password:string)=>void;
};

type PasswordFormPartialState = {
	confirmedPassword:string;
};

/*
	This is a form partial for password setting/resetting.
	
	It will only change the password state to the password if both inputs match (password confirmation). Otherwise it will 
	set the state to empty.
	
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
		
		return (
			<div className="PasswordFormPartial">
				
			</div>
		);
	}
	
}