import React, { Component } from 'react';
import './AmendActionHistoryPage.scss';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';


interface IAmendActionHistoryPageProps {
	scaleName?:string;
	items?:IActionHistoryItem[];
	loadingError?:string;
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
				
				<LoadedContentWrapper errorMessage={this.props.loadingError} render={this.props.items && (<div className="loadedContent">
					
					{/* RecordActionFormContainer will go around here */}
					
					<div className="historyItemsArea">
						
					</div>
					
				</div>)} />
				
			</div>
		);
	}
	
};