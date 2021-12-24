import React, { Component } from 'react';
import './RecordActionForm.scss';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import ITimespan from '../../interfaces/ITimespan';

interface IRecordActionFormProps {
	categories:ICategory[];
	selectedCategory:ICategory;
	setSelectedCategory:(category:ICategory)=>void;
	
	selectedAction:IAction;
	setSelectedAction:(action:IAction)=>void;
	
	timespan:ITimespan;
	setTimespan:(timespan:ITimespan)=>void;
	
	onSubmit:()=>void;
}


/*
	Used to record an occurrence of an action
*/
export default class RecordActionForm extends Component<IRecordActionFormProps>
{
	
	render()
	{
		return (
			<div className="RecordActionForm">
				<form onSubmit={this.props.onSubmit}>
					
					
					<input type="submit" value="Record Action" />
					
				</form>
			</div>
		);
	}
	
};