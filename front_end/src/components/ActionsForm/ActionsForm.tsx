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

export default class ActionsForm extends Component<IActionsFormProps, IActionsFormState> {
	
	
	state:IActionsFormState = {
		displayNewActionForm: false
	}
	
	render()
	{
		
		return (
			<div className="ActionsForm">
				
				<header>
					<h2>Actions</h2>
				</header>
				
				<button 
					className="newActionButton" 
					onClick={()=>this.setState({ displayNewActionForm: true })}
					disabled={this.state.displayNewActionForm}>
						Add New Action
				</button>
				
				<div className="actionsArea">
					
					{this.state.displayNewActionForm && <SingleActionForm 
						name={this.props.newAction.name}
						setName={this.props.newAction.setName}
						weight={this.props.newAction.weight}
						setWeight={this.props.newAction.setWeight}
						onSubmit={this.props.newAction.onSubmit} />}
					
				</div>
				
			</div>
		);
	}
	
};