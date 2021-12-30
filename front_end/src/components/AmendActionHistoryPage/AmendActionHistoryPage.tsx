import React, { Component } from 'react';
import './AmendActionHistoryPage.scss';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';


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
	
	
	
	render()
	{
		
		
		return (
			<div className="AmendActionHistoryPage">
				
			</div>
		);
	}
	
};