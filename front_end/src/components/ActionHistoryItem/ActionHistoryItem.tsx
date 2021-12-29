import React, { FC } from 'react';
import './ActionHistoryItem.scss';
import ITimespan from '../../interfaces/ITimespan';

interface IActionHistoryItemProps {
	categoryName:string;
	actionName:string;
	timespan:ITimespan;
	usesTimespans?:boolean;
}


const ActionHistoryItem:FC<IActionHistoryItemProps> = (props) => {
	
	
	return (
		<div className="ActionHistoryItem">
			
		</div>
	);
	
};


export default ActionHistoryItem;