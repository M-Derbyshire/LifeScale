import React, { Component } from 'react';
import './AmendActionHistoryPage.scss';
import ITimespan from '../../interfaces/ITimespan';


interface IActionHistoryItem {
	categoryName:string;
	actionName:string;
	timespan:ITimespan;
	deleteHandler:()=>void;
	deleteErrorMessage?:string;
}

interface IAmendActionHistoryPageProps {
	scaleName:string;
	items:IActionHistoryItem[];
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

export type { IActionHistoryItem };