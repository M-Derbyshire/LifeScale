import React, { Component } from 'react';
import AmendActionHistoryPage from './AmendActionHistoryPage';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import ITimespan from '../../interfaces/ITimespan';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';


// Used to record errors during the deletion of action history
interface IHistoryItemDeleteError {
	itemID:string;
	errorMessage:string;
}

interface IAmendActionHistoryPageLogicContainerProps {
	scaleID:string;
	userService:IUserService;
	backButtonHandler:()=>void;
}

interface IAmendActionHistoryPageLogicContainerState {
	historyItems?:IActionHistoryItem[];
	scale?:IScale;
	loadingError?:string;
	lastHistoryDeleteError:IHistoryItemDeleteError; //We only need to display the last one
}


export default class AmendActionHistoryPageLogicContainer
	extends Component<IAmendActionHistoryPageLogicContainerProps, IAmendActionHistoryPageLogicContainerState>
{
	
	
	stdScaleLoadError = "Unable to find the selected scale.";
	stdTimespanLoadError = "Unable to load the timescales for the selected scale.";
	
	
	
	constructor(props:IAmendActionHistoryPageLogicContainerProps)
	{
		super(props);
		
		
		const scale = this.props.userService.getScale(this.props.scaleID);
		let historyItems:IActionHistoryItem[]|undefined = undefined;
		
		let loadingError:string|undefined = undefined;
		if (!scale) 
		{
			loadingError = this.stdScaleLoadError;
		}
		else
		{
			try 
			{
				historyItems = this.getRefreshedHistoryItemList(scale);
			} 
			catch {}
		}
		
		
		if (scale && !historyItems)
			loadingError = this.stdTimespanLoadError;
		
		const lastHistoryDeleteError = {
			itemID: "",
			errorMessage: ""
		};
		
		this.state = { scale, loadingError, historyItems, lastHistoryDeleteError };
		
	}
	
	
	
	getRefreshedHistoryItemList(scale = this.state.scale)
	{
		try 
		{
			if(scale)
			{
				return this.props.userService.getScaleTimespans(scale, true).map(
					this.mapTimespanToHistoryItem.bind(this)
				);
			}
		} 
		catch {}
		
		return undefined;
	}
	
	reloadHistoryItemList(scale = this.state.scale)
	{
		const historyItems = this.getRefreshedHistoryItemList(scale);
		let loadingError:string|undefined = undefined;
		
		if(!historyItems)
			loadingError = this.stdTimespanLoadError;
		
		this.setState({
			historyItems,
			loadingError
		});
	}
	
	
	
	timespanDeleteHandler(timespan:ITimespan, parentAction:IAction, parentCategory:ICategory, parentScale:IScale)
	{
		this.props.userService.deleteTimespan(parentScale, parentCategory, parentAction, timespan)
			.then(timespans => this.reloadHistoryItemList())
			.catch(err => {
				this.setState({ 
					lastHistoryDeleteError: { itemID: timespan.id, errorMessage: err.message } 
				});
				this.reloadHistoryItemList();
			});
	}
	
	
	mapTimespanToHistoryItem(timespanDetails:({ timespan:ITimespan, category:ICategory, action:IAction })):IActionHistoryItem
	{
		const hasDeleteError = (this.state && this.state.lastHistoryDeleteError &&
								timespanDetails.timespan.id === this.state.lastHistoryDeleteError.itemID);
		
		return {
			categoryName: timespanDetails.category.name,
			actionName: timespanDetails.action.name,
			timespan: timespanDetails.timespan,
			deleteHandler: () => this.timespanDeleteHandler(
				timespanDetails.timespan, 
				timespanDetails.action,
				timespanDetails.category,
				this.state.scale!, //If no scale, we'll display a loading error instead anyway
			),
			deleteErrorMessage: (!hasDeleteError) ?  undefined : this.state.lastHistoryDeleteError!.errorMessage
		};
	}
	
	
	onSuccessfulItemCreate()
	{
		this.reloadHistoryItemList();
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
					onNewRecordSuccessfulSave={this.onSuccessfulItemCreate.bind(this)} />
			</div>
		);
	}
	
}