import React, { Component } from 'react';
import RecordActionForm from './RecordActionForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import ITimespan from '../../interfaces/ITimespan';


interface IRecordActionFormLogicContainerProps {
	userService:IUserService;
	scale:IScale;
	onSuccessfulSave?:()=>void;
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
				minuteCount: 1,
				date: new Date()
			},
			badSaveErrorMessage: undefined,
			goodSaveMessage: undefined
		};
	}
	
	
	handleSubmit()
	{
		const goodSaveMessage = "Action saved successfully.";
		const noActionMessage = "No action has been selected.";
		const noCategoryMessage = "No category has been selected.";
		
		const selectedCategory = this.props.userService.getCategory(
			this.state.selectedCategoryID, 
			this.props.scale.id
		);
		
		const selectedAction = this.props.userService.getAction(
			this.state.selectedActionID, 
			this.state.selectedCategoryID, 
			this.props.scale.id
		);
		
		if(!selectedCategory)
		{
			this.setState({ badSaveErrorMessage: noCategoryMessage, goodSaveMessage: undefined });
		}
		else if(!selectedAction)
		{
			this.setState({ badSaveErrorMessage: noActionMessage, goodSaveMessage: undefined });
		}
		else
		{
			this.props.userService.createTimespan(this.props.scale, selectedCategory, selectedAction, {
				date: new Date(this.state.timespan.date),
				minuteCount: this.state.timespan.minuteCount
			})
				.then(timespan => {
					this.setState({ 
						...this.getBlankFormData(),
						goodSaveMessage 
					});
					
					if(this.props.onSuccessfulSave)
						this.props.onSuccessfulSave();
				})
				.catch(err => this.setState({ badSaveErrorMessage: err.message, goodSaveMessage: undefined }));
		}
		
	}
	
	
	
	render()
	{
		//The data/callbacks to be passed to the form
		const formItem = {
			...this.state,
			categories: this.props.scale.categories,
			setSelectedCategoryID: (selectedCategoryID:string) => {
				//We also want to set the action ID to the first action, if one available
				let selectedActionID = "";
				const selectedCategory = this.props.scale.categories.find(cat => cat.id === selectedCategoryID);
				if(selectedCategory && selectedCategory.actions.length > 0)
					selectedActionID = selectedCategory.actions[0].id;
				
				this.setState({ 
					selectedCategoryID, 
					selectedActionID
				})
			},
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