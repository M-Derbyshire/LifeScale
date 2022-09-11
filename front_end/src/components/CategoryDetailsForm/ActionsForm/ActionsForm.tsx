import React, { Component } from 'react';
import './ActionsForm.scss';
import IActionFormItem from '../../../interfaces/UI/IActionFormItem';
import SingleActionForm from './SingleActionForm/SingleActionForm';


interface IActionsFormProps {
	actions:IActionFormItem[];
	newAction:IActionFormItem;
	displayNewActionForm:boolean;
	setDisplayNewActionForm:(newVal:boolean)=>void;
}

/*
	Used to Create/Update/Delete actions
*/
export default class ActionsForm extends Component<IActionsFormProps> {
	
	
	mapActionToComponent(action:IActionFormItem)
	{
		return (<SingleActionForm 
					key={`${action.id}-actionItem`}
					name={action.name}
					setName={action.setName}
					weight={action.weight}
					setWeight={action.setWeight}
					onSubmit={action.onSubmit}
					onDelete={action.onDelete}
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
				
				{!this.props.displayNewActionForm && <button 
					className="newActionButton" 
					data-test="newActionFormDisplayBtn"
					onClick={() => this.props.setDisplayNewActionForm(true)} >
						Add New Action
				</button>}
				
				<div className="actionsArea">
					
					{this.props.displayNewActionForm && this.mapActionToComponent(this.props.newAction)}
					
					{this.props.actions.map(this.mapActionToComponent.bind(this))}
					
				</div>
				
			</div>
		);
	}
	
};