import React, { Component } from 'react';
import './RecordActionForm.scss';
import ICategory from '../../interfaces/ICategory';
import ITimespan from '../../interfaces/ITimespan';
import TimespanFormPartial from '../TimespanFormPartial/TimespanFormPartial';

interface IRecordActionFormProps {
	categories:ICategory[];
	selectedCategoryID:string;
	setSelectedCategoryID:(category:string)=>void;
	
	selectedActionID:string;
	setSelectedActionID:(action:string)=>void;
	
	usesTimespans?:boolean
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
	mapItemToOptionElem(name:string, id:any)
	{
		return (
			<option key={id} value={id}>{name}</option>
		);
	}
	
	convertDateToString(date:Date)
	{
		const day = date.getDate();
		const month = date.getMonth() + 1;
		
		const paddedDay = (day < 10) ? `0${day}` : day;
		const paddedMonth = (month < 10) ? `0${month}` : month;
		
		return `${date.getFullYear()}-${paddedMonth}-${paddedDay}`;
	}
	
	render()
	{
		return (
			<div className="RecordActionForm">
				
				<header>
					<h2>Record Action</h2>
				</header>
				
				<div className="formContainer">
					<form onSubmit={this.props.onSubmit}>
						
						<label>
							Category: <select className="categorySelect" 
											value={this.props.selectedCategoryID} 
											onChange={(e) => this.props.setSelectedCategoryID(e.target.value)}>
								
								{this.props.categories.map(
									(cat) => this.mapItemToOptionElem(cat.name, cat.id)
								)}
								
							</select>
						</label>
						
						
						<label>
							Action: <select className="actionSelect" 
										value={this.props.selectedActionID} 
										onChange={(e) => this.props.setSelectedActionID(e.target.value)}>
								
								{this.props.categories.find(cat => cat.id === this.props.selectedCategoryID)!.actions.map(
									(act) => this.mapItemToOptionElem(act.name, act.id)
								)}
								
							</select>
						</label>
						
						
						<label>
							Date: <input 
									type="date" 
									className="actionDate" 
									value={this.convertDateToString(this.props.timespan.date)}
									onChange={(e) => this.props.setTimespan({ ...this.props.timespan, date: new Date(e.target.value) })} />
						</label>
						
						{this.props.usesTimespans && <TimespanFormPartial 
							minutes={this.props.timespan.minuteCount}
							setMinutes={(mins:number) => this.props.setTimespan({...this.props.timespan, minuteCount: mins})} />}
						
						<input type="submit" value="Record Action" />
						
					</form>
				</div>
			</div>
		);
	}
	
};