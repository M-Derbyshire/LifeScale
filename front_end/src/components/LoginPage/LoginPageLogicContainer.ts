import React, { Component } from 'react';
import LoginPage from './LoginPage';
import IUserService from '../../interfaces/api_access/IUserService';

interface ILoginPageLogicContainerProps {
	userService:IUserService;
	registerPath:string;
	forgotPasswordPath:string;
}

interface ILoginPageLogicContainerState {
	email:string;
	password:string;
	badLoginErrorMessage?:string;
}



export default class LoginPageLogicContainer 
	extends Component<ILoginPageLogicContainerProps, ILoginPageLogicContainerState> 
{
	
	
	
}