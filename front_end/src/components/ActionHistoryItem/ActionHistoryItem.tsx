import React, { FC } from 'react';
import './ActionHistoryItem.scss';
import ITimespan from '../../interfaces/ITimespan';

interface IActionHistoryItemProps {
	categoryName:string;
	actionName:string;
	timespan:ITimespan;
	usesTimespan?:boolean;
	deleteHandler:()=>void;
}

const dateDisplayStringfromDate = (date:Date) => {
	return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
};

const ActionHistoryItem:FC<IActionHistoryItemProps> = (props) => {
	
	
	return (
		<div className="ActionHistoryItem">
			
			<div className="itemCategoryNameDisplay">
				<span className="itemInfoLabel">Category: </span> {props.categoryName}
			</div>
			
			<div className="itemActionNameDisplay">
				<span className="itemInfoLabel">Action: </span> {props.actionName}
			</div>
			
			<div className="itemDateDisplay">
				<span className="itemInfoLabel">Date: </span> {dateDisplayStringfromDate(props.timespan.date)}
			</div>
			
			{ props.usesTimespan && <div className="itemMinutesDisplay">
				<span className="itemInfoLabel">Time spent (in minutes): </span> {props.timespan.minuteCount}
			</div>}
			
			{ props.usesTimespan && <div className="itemHoursDisplay">
				<span className="itemInfoLabel">Time spent (in hours): </span> {(props.timespan.minuteCount / 60).toFixed(2)}
			</div>}
			
		</div>
	);
	
};


export default ActionHistoryItem;