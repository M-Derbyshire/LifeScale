import React, { Component } from 'react';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import IScaleLink from '../../interfaces/UI/IScaleLink';
import UserNavBar from './UserNavBar';


interface IUserNavBarLogicContainerProps {
	userService:IUserService;
	onSuccessfulLogout:()=>void; //Called after successful logout
	editUserURL:string;
	createScaleURL:string; 
	scaleURLBase:string; //E.g. "scales" in "/scales/id1234"
}

interface IUserNavBarLogicContainerState {
	user?:IUser;
	failedLogoutErrorMessage?:string;
}




/*
	Wrapper component that controls the business logic for the UserNavBar component.
	See the UserNavBar component for more description.
*/
export default class UserNavBarLogicContainer 
	extends Component<IUserNavBarLogicContainerProps, IUserNavBarLogicContainerState>
{
	
	constructor(props:IUserNavBarLogicContainerProps)
	{
		super(props);
		
		let user;
		
		try 
		{
			user = this.props.userService.getLoadedUser();
		} catch {};
		
		this.state = {
			user, //May be undefined
			failedLogoutErrorMessage: undefined
		};
	}
	
	
	
	
	
	mapScaleToScaleLink(scale:IScale):IScaleLink
	{
		return { 
			label: scale.name, 
			url: `/${this.props.scaleURLBase}/${scale.id}` 
		};
	}
	
	
	
	
	
	logoutCallback()
	{
		this.props.userService.logoutUser()
			.then(n => this.props.onSuccessfulLogout())
			.catch(err => this.setState({ 
				failedLogoutErrorMessage: "Error while logging out: " + err.message 
			}));
	}
	
	
	
	
	render()
	{
		
		const scaleLinks = 
			(!this.state.user) ? [] : this.state.user.scales.map(this.mapScaleToScaleLink.bind(this));
		
		return (
			<div className="UserNavBarLogicContainer">
				<UserNavBar 
					scaleLinks={scaleLinks}
					editUserURL={this.props.editUserURL}
					createScaleURL={this.props.createScaleURL}
					logoutCallback={this.logoutCallback.bind(this)}
					failedLogoutErrorMessage={this.state.failedLogoutErrorMessage} />
			</div>
		);
	}
	
}