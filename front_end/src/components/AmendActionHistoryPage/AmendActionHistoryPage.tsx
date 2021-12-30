import React, { Component } from 'react';
import './AmendActionHistoryPage.scss';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';


interface IAmendActionHistoryPageProps {
	scaleName?:string;
	items?:IActionHistoryItem[];
	loadingError?:string;
	backButtonHandler:()=>void;
}



/*
	Used to delete previous occurences of actions on a given scale, and to add new ones.
	(Once RecordActionFormContainer has been completed, the recording functionality can be added to this)
*/
export default class AmendActionHistoryPage extends Component<IAmendActionHistoryPageProps> {
	
	
	mapHistoryItemsToComponents(item:IActionHistoryItem)
	{
		
		// return (<div/>);
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
					
					{/* RecordActionFormContainer will go around here */}
					
					<div className="historyItemsArea">
						
					</div>
					
				</div>)} />
				
			</div>
		);
	}
	
};