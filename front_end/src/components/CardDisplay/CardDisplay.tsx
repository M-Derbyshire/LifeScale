import React, { FC } from 'react';
import './CardDisplay.scss';

interface ICardDisplayProps {
	children?: ReactChild | ReactChild[];
	emptyDisplayMessage:string; //The message to display if children is empty
}

const CardDisplay:FC<ICardDisplayProps> = (props) => {
	
	return (
		<div className="CardDisplay">
			
			{!props.children && <span>
				{props.emptyDisplayMessage}
			</span>}
			
		</div>
	);
	
};

export default CardDisplay;