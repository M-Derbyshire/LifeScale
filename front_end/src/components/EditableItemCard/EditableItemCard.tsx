import React, { FC } from 'react';
import './EditableItemCard.scss';

interface IEditableItemCardProps {
	name:string;
	editCallback:()=>void;
}

/*
	Card to be an item in a flex container. This card will be used to display items that can be edited 
	on another screen (the Edit button will take you to the other scree -- via the editCallback prop)
*/
const EditableItemCard:FC<IEditableItemCardProps> = (props) => {
	
	return (
		<div className="EditableItemCard">
			<span>{props.name}</span>
			<br/>
			<button onClick={props.editCallback}>Edit</button>
		</div>
	);
	
};

export default EditableItemCard;