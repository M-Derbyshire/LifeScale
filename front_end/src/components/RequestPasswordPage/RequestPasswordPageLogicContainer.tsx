import React, { Component } from 'react';
import RequestPasswordPage from './RequestPasswordPage';
import IUserService from '../../interfaces/api_access/IUserService';


interface IRequestPasswordPageLogicContainerProps {
	userService:IUserService;
}

interface IRequestPasswordPageLogicContainerState {
	email:string;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}

export default class RequestPasswordPageLogicContainer 
	extends Component<IRequestPasswordPageLogicContainerProps, IRequestPasswordPageLogicContainerState> 
{
	
	constructor(props:IRequestPasswordPageLogicContainerProps)
	{
		super(props);
		
		this.state = {
			email: "",
			badSaveErrorMessage: undefined,
			goodSaveMessage: undefined
		};
	}
	
	
	render()
	{
		
		return (
			<div className="RequestPasswordPageLogicContainer">
				
			</div>
		);
	}
	
}