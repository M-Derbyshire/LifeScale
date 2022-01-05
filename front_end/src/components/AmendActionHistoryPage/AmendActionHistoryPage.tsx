import React, { Component } from 'react';
import './AmendActionHistoryPage.scss';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';
import IRecordedActionFormItem from '../../interfaces/UI/IRecordedActionFormItem';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import ActionHistoryItem from '../ActionHistoryItem/ActionHistoryItem';
import RecordActionForm from '../RecordActionForm/RecordActionForm';


interface IAmendActionHistoryPageProps {
	scaleName?:string;
	scaleUsesTimespans?:boolean,
	items?:IActionHistoryItem[];
	loadingError?:string;
	newRecordedAction:IRecordedActionFormItem;
	backButtonHandler:()=>void;
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
				usesTimespan={this.props.scaleUsesTimespans} />
		);
	}
	
	
	render()
	{
		
		return (
			<div className="AmendActionHistoryPage">
				
				<header>
					<h1>Amend Action History{this.props.scaleName && ` - ${this.props.scaleName}`}:</h1>
					<button className="actionHistoryBackButton" onClick={this.props.backButtonHandler}>Back</button>
				</header>
				
				<LoadedContentWrapper errorMessage={this.props.loadingError} render={this.props.items && (<div className="loadedContent">
					
					<RecordActionForm recordedAction={this.props.newRecordedAction} />
					
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