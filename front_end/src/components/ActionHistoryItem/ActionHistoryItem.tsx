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


const ActionHistoryItem:FC<IActionHistoryItemProps> = (props) => {
	
	
	return (
		<div className="ActionHistoryItem">
			
			<div className="itemCategoryNameDisplay">
				<span className="itemInfoLabel">Category: </span> {props.categoryName}
			</div>
			
			<div className="itemActionNameDisplay">
				<span className="itemInfoLabel">Action: </span> {props.actionName}
			</div>
			
		</div>
	);
	
};


export default ActionHistoryItem;