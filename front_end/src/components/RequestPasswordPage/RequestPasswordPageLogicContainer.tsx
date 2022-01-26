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
	
	
	handleSubmit()
	{
		this.props.userService.requestNewPassword(this.state.email);
	}
	
	render()
	{
		
		return (
			<div className="RequestPasswordPageLogicContainer">
				<RequestPasswordPage 
					email={this.state.email}
					setEmail={(email:string)=>this.setState({ email })}
					onSubmit={this.handleSubmit.bind(this)}
					badSaveErrorMessage={this.state.badSaveErrorMessage}
					goodSaveMessage={this.state.goodSaveMessage} />
			</div>
		);
	}
	
}