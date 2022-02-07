import React, { Component } from 'react';
import ActionsForm from './ActionsForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IAction from '../../interfaces/IAction';



// Used to record error/success during the deletion/saving of actions
interface IActionSaveMessage {
	actionID:string;
	isError:boolean;
	saveMessage:string;
}

interface IActionsFormLogicContainerProps {
	userService:IUserService;
	scaleID:string;
	categoryID:string;
}

interface IActionsFormLogicContainerState {
	actions?:IAction[];
	loadingError?:string;
	lastActionSaveMessage:IActionSaveMessage; //We only need to display the last save message (good or bad)
}


export default class ActionsFormLogicContainer
	extends Component<IActionsFormLogicContainerProps, IActionsFormLogicContainerState>
{
	
	constructor(props:IActionsFormLogicContainerProps)
	{
		super(props)
		
		
	}
	
	
	
	render()
	{
		
		
		return (
			<div className="ActionsFormLogicContainer">
				<ActionsForm 
					actions={[]}
					newAction={{
						name: "test",
						setName:(name:string)=>{},
						weight: 1,
						setWeight: (weight:number)=>{},
						onSubmit: ()=>{},
						onDelete: undefined,
						badSaveErrorMessage: undefined,
						goodSaveMessage: undefined
					}} />
			</div>
		);
	}
	
};