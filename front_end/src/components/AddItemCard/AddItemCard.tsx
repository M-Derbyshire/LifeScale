import React, { FC } from 'react';
import './AddItemCard.scss';

interface IAddItemCardProps {
	onClick:()=>void;
}

/*
	Card to be an item in a flex container. This card will be used to take you to 
	A screen to add a new item
*/
const AddItemCard:FC<IAddItemCardProps> = (props) => {
	
	return (
		<div className="AddItemCard" onClick={props.onClick}>
			{/* Inner div used for styling purposes (we want the cursor to be pointer on the padding as well) */}
			<div className="addItemCardContent">
				<span>+</span>
			</div>
		</div>
	);
	
};

export default AddItemCard;