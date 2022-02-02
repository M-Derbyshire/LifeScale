import React, { Component } from 'react';
import AmendActionHistoryPage from './AmendActionHistoryPage';
import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';


interface IAmendActionHistoryPageLogicContainerProps {
	scaleID:string;
	userService:IUserService;
	backButtonHandler:()=>void;
}

interface IAmendActionHistoryPageLogicContainerState {
	historyItems:IActionHistoryItem[];
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
		const historyItems = new Array<IActionHistoryItem>();
		const loadingError = (scale) ? undefined : "Unable to find the selected scale.";
		
		this.state = { scale, loadingError, historyItems };
		
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
					backButtonHandler={()=>{}}
					onNewRecordSuccessfulSave={()=>{}} />
			</div>
		);
	}
	
}