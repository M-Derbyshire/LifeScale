import React, { Component } from 'react';
import './AmendActionHistoryPage.scss';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';
import IScale from '../../interfaces/IScale';
import IUserService from '../../interfaces/api_access/IUserService';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import ActionHistoryItem from '../ActionHistoryItem/ActionHistoryItem';
import RecordActionFormLogicContainer from '../RecordActionForm/RecordActionFormLogicContainer';


interface IAmendActionHistoryPageProps {
	scale?:IScale;
	userService:IUserService;
	items?:IActionHistoryItem[];
	loadingError?:string;
	backButtonHandler:()=>void;
	onNewRecordSuccessfulSave?:()=>void;
}



/*
	Used to delete previous occurences of actions on a given scale, and to add new ones.
*/
export default class AmendActionHistoryPage extends Component<IAmendActionHistoryPageProps> {
	
	
	mapHistoryItemToComponent(item:IActionHistoryItem)
	{
		return (
			<ActionHistoryItem
				key={item.timespan.id}
				actionHistoryItem={item}
				usesTimespan={this.props.scale!.usesTimespans} />
		);
	}
	
	
	render()
	{
		
		return (
			<div className="AmendActionHistoryPage">
				
				<header>
					<h1>Amend Action History - {this.props.scale && this.props.scale.name}:</h1>
					<button className="actionHistoryBackButton" onClick={this.props.backButtonHandler}>Back</button>
				</header>
				
				<LoadedContentWrapper 
					errorMessage={this.props.loadingError} 
					render={this.props.items && this.props.scale && (<div className="loadedContent">
					
						<RecordActionFormLogicContainer 
							scale={this.props.scale}
							userService={this.props.userService}
							onSuccessfulSave={this.props.onNewRecordSuccessfulSave} />
						
						<div className="historyItemsArea">
							{this.props.items.map(this.mapHistoryItemToComponent.bind(this))}
							
							{this.props.items.length === 0 && <span className="noHistoryItemsMessage">
								There are no historical actions recorded for this scale.
							</span>}
						</div>
					
				</div>)} />
				
			</div>
		);
	}
	
};