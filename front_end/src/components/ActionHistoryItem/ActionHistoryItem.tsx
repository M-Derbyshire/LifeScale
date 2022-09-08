import React, { FC } from 'react';
import './ActionHistoryItem.scss';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import IActionHistoryItem from '../../interfaces/UI/IActionHistoryItem';

interface IActionHistoryItemProps {
	actionHistoryItem:IActionHistoryItem;
	usesTimespan?:boolean;
}

const dateDisplayStringfromDate = (date:Date) => {
	return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
};


/*
	Used to display an occurrence of an action
*/
const ActionHistoryItem:FC<IActionHistoryItemProps> = (props) => {
	
	
	return (
		<div className="ActionHistoryItem" data-test="actionHistoryItem">
			
			<div className="historyItemDetailsContainer">
				
				<div className="itemCategoryNameDisplay">
					<span className="itemInfoLabel">Category: </span> {props.actionHistoryItem.categoryName}
				</div>
				
				<div className="itemActionNameDisplay">
					<span className="itemInfoLabel">Action: </span> {props.actionHistoryItem.actionName}
				</div>
				
				<div className="itemDateDisplay">
					<span className="itemInfoLabel">Date: </span> {dateDisplayStringfromDate(props.actionHistoryItem.timespan.date)}
				</div>
				
				{ props.usesTimespan && <div className="itemMinutesDisplay">
					<span className="itemInfoLabel">Time spent (in minutes): </span> {props.actionHistoryItem.timespan.minuteCount}
				</div>}
				
				{ props.usesTimespan && <div className="itemHoursDisplay">
					<span className="itemInfoLabel">Time spent (in hours): </span> {(props.actionHistoryItem.timespan.minuteCount / 60).toFixed(2)}
				</div>}
				
				<button onClick={props.actionHistoryItem.deleteHandler} data-test="actionHistoryDeleteBtn">Delete</button>
				
			</div>
			
			{ props.actionHistoryItem.deleteErrorMessage && <div>
				<br />
				<BadSaveMessage message={props.actionHistoryItem.deleteErrorMessage} />
			</div>}
			
		</div>
	);
	
};


export default ActionHistoryItem;