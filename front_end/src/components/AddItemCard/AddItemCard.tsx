import React, { FC } from 'react';
import './AddItemCard.scss';

interface IAddItemCardProps {
	onClick:()=>void;
}

const AddItemCard:FC<IAddItemCardProps> = (props) => {
	
	return (
		<div className="AddItemCard">
			<span>+</span>
		</div>
	);
	
};

export default AddItemCard;