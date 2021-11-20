import React, { FC } from 'react';
import './EditableItemCard.scss';

interface IEditableItemCardProps {
	name:string;
	editCallback:()=>void;
}

const EditableItemCard:FC<IEditableItemCardProps> = (props) => {
	
	return (
		<div className="EditableItemCard">
			<span className="itemName">{props.name}</span>
		</div>
	);
	
};

export default EditableItemCard;