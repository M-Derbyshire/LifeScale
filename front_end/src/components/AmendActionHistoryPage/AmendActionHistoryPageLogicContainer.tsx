import React, { Component } from 'react';
import AmendActionHistoryPage from './AmendActionHistoryPage';
import IScale from '../../interfaces/IScale';
import IUserService from '../../interfaces/api_access/IUserService';


interface IAmendActionHistoryPageLogicContainerProps {
	scale:IScale;
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