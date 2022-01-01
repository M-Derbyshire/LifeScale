import React, { Component } from 'react';
import './ActionsForm.scss';
import IActionFormItem from '../../interfaces/UI/IActionFormItem';


interface IActionsFormProps {
	actions:IActionFormItem[];
	newAction:IActionFormItem;
}

interface IActionsFormState {
	displayNewActionForm:boolean;
}

export default class ActionsForm extends Component<IActionsFormProps, IActionsFormState> {
	
	
	render()
	{
		
		return (
			<div className="ActionsForm">
				
				<header>
					<h2>Actions</h2>
				</header>
				
			</div>
		);
	}
	
};