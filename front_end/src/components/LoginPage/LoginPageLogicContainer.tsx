import React, { Component } from 'react';
import LoginPage from './LoginPage';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';

interface ILoginPageLogicContainerProps {
	userService:IUserService;
	onSuccessfulLogin:()=>void;
	registerPath:string; //The URL path to the register user page
	forgotPasswordPath:string; //The URL path to the request new password page
}

interface ILoginPageLogicContainerState {
	email:string;
	password:string;
	badLoginErrorMessage?:string;
}





/*
	Wrapper component that controls the business logic for the LoginPage component.
	See the LoginPage component for more description.
*/
export default class LoginPageLogicContainer 
	extends Component<ILoginPageLogicContainerProps, ILoginPageLogicContainerState> 
{
	
	constructor(props:ILoginPageLogicContainerProps)
	{
		super(props);
		
		this.state = {
			email: "",
			password: "",
			badLoginErrorMessage: undefined
		};
	}
	
	
	handleLogin()
	{
		this.props.userService.loginUser(this.state.email, this.state.password)
			.then((user:IUser) => this.props.onSuccessfulLogin())
			.catch(err => this.setState({ badLoginErrorMessage: err.message }));
	}
	
	render()
	{
		return (
			<div className="LoginPageLogicContainer">
				<LoginPage 
					email={this.state.email}
					setEmail={(email:string) => this.setState({ email })}
					password={this.state.password}
					setPassword={(password:string) => this.setState({ password })}
					loginHandler={this.handleLogin.bind(this)}
					badLoginErrorMessage={this.state.badLoginErrorMessage}
					registerUserLinkPath={this.props.registerPath}
					forgotPasswordLinkPath={this.props.forgotPasswordPath} />
			</div>
		);
	}
	
}