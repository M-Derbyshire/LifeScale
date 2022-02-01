import React, { Component } from 'react';
import RecordActionForm from './RecordActionForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import ITimespan from '../../interfaces/ITimespan';
import convertDateToInputString from '../../utility_functions/convertDateToInputString';


interface IRecordActionFormLogicContainerProps {
	userService:IUserService;
	scale:IScale;
}

interface IRecordActionFormLogicContainerState {
	selectedCategoryID:string;
	selectedActionID:string;
	
	timespan:ITimespan;
	
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}


export default class RecordActionFormLogicContainer
	extends Component<IRecordActionFormLogicContainerProps, IRecordActionFormLogicContainerState>
{
	
	constructor(props:IRecordActionFormLogicContainerProps)
	{
		super(props);
		
		this.state = { ...this.getBlankFormData() };
	}
	
	
	
	getBlankFormData()
	{
		const selectedCategory = 
			(this.props.scale.categories.length > 0) ? this.props.scale.categories[0] : undefined;
		const selectedAction = 
			(selectedCategory && selectedCategory.actions.length > 0) ? selectedCategory.actions[0] : undefined;
		
		
		return {
			selectedCategoryID: (selectedCategory) ? selectedCategory.id : "",
			selectedActionID: (selectedAction) ? selectedAction.id : "",
			timespan: {
				id: "",
				minuteCount: 0,
				date: new Date()
			},
			badSaveErrorMessage: undefined,
			goodSaveMessage: undefined
		};
	}
	
	
	handleSubmit()
	{
		const goodSaveMessage = "Action saved successfully.";
		
		const selectedAction = this.props.userService.getAction(
			this.state.selectedActionID, 
			this.state.selectedCategoryID, 
			this.props.scale.id
		);
		
		
		this.props.userService.createTimespan(selectedAction!, {
			date: new Date(this.state.timespan.date),
			minuteCount: this.state.timespan.minuteCount
		})
			.then(timespan => this.setState({ 
				...this.getBlankFormData(),
				goodSaveMessage 
			}))
			.catch(err => this.setState({ badSaveErrorMessage: err.message }));
	}
	
	
	
	render()
	{
		//The data/callbacks to be passed to the form
		const formItem = {
			...this.state,
			categories: this.props.scale.categories,
			setSelectedCategoryID: (selectedCategoryID:string) => this.setState({ selectedCategoryID }),
			setSelectedActionID: (selectedActionID:string) => this.setState({ selectedActionID }),
			setTimespan: (timespan:ITimespan) => this.setState({ timespan }),
			usesTimespans: this.props.scale.usesTimespans,
			onSubmit: this.handleSubmit.bind(this)
		};
		
		
		return (
			<div className="RecordActionFormLogicContainer">
				<RecordActionForm 
					recordedAction={formItem} />
			</div>
		);
	}
	
}