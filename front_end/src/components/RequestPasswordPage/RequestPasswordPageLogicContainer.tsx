import React, { Component } from 'react';
import RequestPasswordPage from './RequestPasswordPage';
import IUserService from '../../interfaces/api_access/IUserService';


interface IRequestPasswordPageLogicContainerProps {
	userService:IUserService;
	backButtonHandler:()=>void;
}

interface IRequestPasswordPageLogicContainerState {
	email:string;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}



/*
	Wrapper component that controls the business logic for the RequestPasswordPage component.
	See the RequestPasswordPage component for more description.
*/
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
	
	
	
	componentWillUnmount()
	{
		this.props.userService.abortRequests();
	}
	
	
	handleSubmit()
	{
		const standardGoodSaveMessage = "A new password has now been sent via email.";
		
		this.props.userService.requestNewPassword(this.state.email)
			.then((x) => this.setState({ 
				badSaveErrorMessage: undefined, 
				goodSaveMessage: standardGoodSaveMessage 
			}))
			.catch(err => this.setState({
				badSaveErrorMessage: err.message,
				goodSaveMessage: undefined
			}));
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
					goodSaveMessage={this.state.goodSaveMessage}
					backButtonHandler={this.props.backButtonHandler} />
			</div>
		);
	}
	
}