import React, { Component } from 'react';
import AmendActionHistoryPage from './AmendActionHistoryPage';
import IUserService from '../../interfaces/api_access/IUserService';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';


interface IAmendActionHistoryPageLogicContainerProps {
	scaleID:string;
	userService:IUserService;
	backButtonHandler:()=>void;
}

interface IAmendActionHistoryPageLogicContainerState {
	historyItems:IActionHistoryItem;
}


export default class AmendActionHistoryPageLogicContainer
	extends Component<IAmendActionHistoryPageLogicContainerProps, IAmendActionHistoryPageLogicContainerState>
{
	
	
	constructor(props:IAmendActionHistoryPageLogicContainerProps)
	{
		super(props);
		
		
	}
	
	
	
	render()
	{
		
		
		return (
			<div className="AmendActionHistoryPageLogicContainer">
				
			</div>
		);
	}
	
}