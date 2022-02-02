import React, { Component } from 'react';
import AmendActionHistoryPage from './AmendActionHistoryPage';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import ITimespan from '../../interfaces/ITimespan';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';


interface IAmendActionHistoryPageLogicContainerProps {
	scaleID:string;
	userService:IUserService;
	backButtonHandler:()=>void;
}

interface IAmendActionHistoryPageLogicContainerState {
	historyItems?:IActionHistoryItem[];
	scale?:IScale;
	loadingError?:string;
}


export default class AmendActionHistoryPageLogicContainer
	extends Component<IAmendActionHistoryPageLogicContainerProps, IAmendActionHistoryPageLogicContainerState>
{
	
	
	constructor(props:IAmendActionHistoryPageLogicContainerProps)
	{
		super(props);
		
		const scale = this.props.userService.getScale(this.props.scaleID);
		let historyItems:IActionHistoryItem[]|undefined = undefined;
		
		let loadingError:string|undefined = undefined;
		if (!scale) 
		{
			loadingError = "Unable to find the selected scale.";
		}
		else
		{
			try 
			{
				historyItems = this.props.userService.getScaleTimespans(scale, true).map(
					this.mapTimespanToHistoryItem.bind(this)
				);
			} 
			catch {}
		}
		
		if (scale && !historyItems)
			loadingError = "Unable to load the timescales for the selected scale.";
		
		this.state = { scale, loadingError, historyItems };
		
	}
	
	
	mapTimespanToHistoryItem(timespanDetails:(ITimespan & { category:ICategory, action:IAction })):IActionHistoryItem
	{
		return {
			categoryName: timespanDetails.category.name,
			actionName: timespanDetails.action.name,
			timespan: {
				id: timespanDetails.id,
				date: new Date(timespanDetails.date),
				minuteCount: timespanDetails.minuteCount
			},
			deleteHandler: ()=>{},
			deleteErrorMessage: undefined
		};
	}
	
	
	render()
	{
		
		return (
			<div className="AmendActionHistoryPageLogicContainer">
				<AmendActionHistoryPage 
					scale={(this.state) ? this.state.scale : undefined}
					userService={this.props.userService}
					items={this.state.historyItems}
					loadingError={this.state.loadingError}
					backButtonHandler={this.props.backButtonHandler}
					onNewRecordSuccessfulSave={()=>{}} />
			</div>
		);
	}
	
}