import React, { Component } from 'react';
import RequestPasswordPage from './RequestPasswordPage';
import IUserService from '../../interfaces/api_access/IUserService';


interface IRequestPasswordPageLogicContainerProps {
	userService:IUserService;
}

export default class RequestPasswordPageLogicContainer 
	extends Component<IRequestPasswordPageLogicContainerProps> 
{
	
	
	render()
	{
		
		return (
			<div className="RequestPasswordPageLogicContainer">
				
			</div>
		);
	}
	
}