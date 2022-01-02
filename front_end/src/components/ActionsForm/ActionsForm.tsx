import React, { Component } from 'react';
import './ActionsForm.scss';
import IActionFormItem from '../../interfaces/UI/IActionFormItem';
import SingleActionForm from '../SingleActionForm/SingleActionForm';


interface IActionsFormProps {
	actions:IActionFormItem[];
	newAction:IActionFormItem;
}

interface IActionsFormState {
	displayNewActionForm:boolean;
}

/*
	Used to Create/Update/Delete actions
*/
export default class ActionsForm extends Component<IActionsFormProps, IActionsFormState> {
	
	
	state:IActionsFormState = {
		displayNewActionForm: false
	}
	
	
	mapActionToComponent(action:IActionFormItem)
	{
		return (<SingleActionForm 
					key={`${action.name}-actionItem`}
					name={action.name}
					setName={action.setName}
					weight={action.weight}
					setWeight={action.setWeight}
					onSubmit={action.onSubmit}
					goodSaveMessage={action.goodSaveMessage}
					badSaveErrorMessage={action.badSaveErrorMessage} />);
	}
	
	render()
	{
		
		return (
			<div className="ActionsForm">
				
				<header>
					<h2>Actions</h2>
				</header>
				
				{!this.state.displayNewActionForm && <button 
					className="newActionButton" 
					onClick={()=>this.setState({ displayNewActionForm: true })} >
						Add New Action
				</button>}
				
				<div className="actionsArea">
					
					{this.state.displayNewActionForm && this.mapActionToComponent(this.props.newAction)}
					
					{this.props.actions.map(this.mapActionToComponent.bind(this))}
					
				</div>
				
			</div>
		);
	}
	
};