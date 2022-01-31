import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import UserNavBar from './UserNavBar';


interface IUserNavBarLogicContainerProps {
	userService:IUserService;
	onSuccessfulLogout:()=>void; //Called after successful logout
	editUserURL:string;
	createScaleURL:string; 
}

interface IUserNavBarLogicContainerState {
	user:IUser;
	failedLogoutErrorMessage:string;
}


export default class UserNavBarLogicContainer 
	extends Component<IUserNavBarLogicContainerProps, IUserNavBarLogicContainerState>
{
	
	constructor(props:IUserNavBarLogicContainerProps)
	{
		super(props);
		
		
	}
	
	
	render()
	{
		
		return (
			<div className="UserNavBarLogicContainer">
				
			</div>
		);
	}
	
}