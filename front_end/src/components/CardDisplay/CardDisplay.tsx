import React, { FC, ReactChild } from 'react';
import './CardDisplay.scss';

interface ICardDisplayProps {
	children?: ReactChild | ReactChild[];
	emptyDisplayMessage:string; //The message to display if children is empty
}

/*
	Acts as a flex container, to display its children
*/
const CardDisplay:FC<ICardDisplayProps> = (props) => {
	
	return (
		<div className="CardDisplay">
			
			{!props.children && <span className="emptyDisplayMessage">
				{props.emptyDisplayMessage}
			</span>}
			
			{props.children}
			
		</div>
	);
	
};

export default CardDisplay;