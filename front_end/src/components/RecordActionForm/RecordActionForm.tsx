import React, { Component } from 'react';
import './RecordActionForm.scss';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import ITimespan from '../../interfaces/ITimespan';

interface IRecordActionFormProps {
	categories:ICategory[];
	selectedCategoryID:string;
	setSelectedCategoryID:(category:string)=>void;
	
	selectedActionID:string;
	setSelectedActionID:(action:string)=>void;
	
	timespan:ITimespan;
	setTimespan:(timespan:ITimespan)=>void;
	
	onSubmit:()=>void;
}


/*
	Used to record an occurrence of an action
*/
export default class RecordActionForm extends Component<IRecordActionFormProps>
{
	
	// Used to map categories and actions to option elements
	// mapItemToOptionElem(key:string, name:string, value:any)
	// {
	// 	return (
	// 		<option key={key} value={value}>{name}</option>
	// 	);
	// }
	
	render()
	{
		return (
			<div className="RecordActionForm">
				<form onSubmit={this.props.onSubmit}>
					
					{/* <label>
						Category: 
						<select className="categorySelect" value={this.props.selectedCategory}>
							{this.props.categories.map(
								(cat, i) => this.mapItemToOptionElem(cat.id, cat.name, i)
							)}
						</select>
					</label> */}
					
					<input type="submit" value="Record Action" />
					
				</form>
			</div>
		);
	}
	
};