import React, { FC } from 'react';
import './EditableItemCard.scss';

interface IEditableItemCardProps {
	name:string;
	editCallback:()=>void;
}

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