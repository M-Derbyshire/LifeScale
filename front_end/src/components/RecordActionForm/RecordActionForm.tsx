import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RecordActionForm.scss';
import IRecordedActionFormItem from '../../interfaces/UI/IRecordedActionFormItem';
import TimespanFormPartial from './TimespanFormPartial/TimespanFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';
import convertDateToInputString from '../../utility_functions/convertDateToInputString';

interface IRecordActionFormProps {
	recordedAction: IRecordedActionFormItem;
}


/*
	Used to record an occurrence of an action
*/
export default class RecordActionForm extends Component<IRecordActionFormProps>
{
	
	// Used to map categories and actions to <option> elements
	mapItemToOptionElem(name:string, id:any)
	{
		return (
			<option key={id} value={id}>{name}</option>
		);
	}
	
	
	render()
	{
		const selectedCategory = this.props.recordedAction.categories
									.find(cat => cat.id === this.props.recordedAction.selectedCategoryID)
		
		const selectedAction = (!selectedCategory) ? undefined 
													: selectedCategory.actions.find(act => act.id === this.props.recordedAction.selectedActionID);
		
		const disableSubmit = (
			this.props.recordedAction.categories.length === 0 
			|| !this.props.recordedAction.selectedCategoryID
			|| !selectedCategory
			|| selectedCategory.actions.length === 0
			|| !this.props.recordedAction.selectedActionID
			|| !selectedAction
		);
		
		return (
			<div className="RecordActionForm" data-test="recordActionForm">
				
				<header>
					<h2>Record Action</h2>
				</header>
				
				<div className="formContainer">
					<form onSubmit={(e) => { e.preventDefault(); this.props.recordedAction.onSubmit() }}>
						
						<label>
							Category: <select className="categorySelect"
											data-test="recordActionCategorySelect"
											required 
											value={this.props.recordedAction.selectedCategoryID} 
											onChange={
												(e) => this.props.recordedAction.setSelectedCategoryID(e.target.value)
											}>
								
								{/* <option> elements for this <select> */}
								{this.props.recordedAction.categories.map(
									(cat) => this.mapItemToOptionElem(cat.name, cat.id)
								)}
								
							</select>
						</label>
						
						
						<label>
							Action: <select className="actionSelect" 
										required
										data-test="recordActionActionSelect"
										value={this.props.recordedAction.selectedActionID} 
										onChange={
											(e) => this.props.recordedAction.setSelectedActionID(e.target.value)
										}>
								
								{/* <option> elements for this <select> */}
								{this.props.recordedAction.categories.length > 0 && selectedCategory &&
									selectedCategory.actions.map(
										(act) => this.mapItemToOptionElem(act.name, act.id)
									)}
								
							</select>
						</label>
						
						
						<label>
							Date: <DatePicker
									className="actionDate" 
									value={convertDateToInputString(this.props.recordedAction.timespan.date)}
									
									onChange={(date) => this.props.recordedAction.setTimespan({
										 ...this.props.recordedAction.timespan, 
										 date: date! 
									})} />
						</label>
						
						{this.props.recordedAction.usesTimespans && <TimespanFormPartial 
							minutes={this.props.recordedAction.timespan.minuteCount}
							minuteDisplayValue={this.props.recordedAction.minuteDisplayValue}
							hourDisplayValue={this.props.recordedAction.hourDisplayValue}
							setMinutes={(mins:number) => this.props.recordedAction.setTimespan({
								...this.props.recordedAction.timespan, 
								minuteCount: mins
							})}
							setMinuteDisplayValue={this.props.recordedAction.setMinuteDisplayValue}
							setHourDisplayValue={this.props.recordedAction.setHourDisplayValue} />}
						
						
						<input type="submit" data-test="recordActionSaveBtn" disabled={disableSubmit} value="Record Action" />
						
						
						{this.props.recordedAction.badSaveErrorMessage && 
							<BadSaveMessage message={this.props.recordedAction.badSaveErrorMessage} />}
						{this.props.recordedAction.goodSaveMessage && 
							<GoodSaveMessage message={this.props.recordedAction.goodSaveMessage} />}
						
					</form>
				</div>
			</div>
		);
	}
	
};