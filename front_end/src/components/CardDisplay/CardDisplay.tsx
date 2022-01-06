import React, { FC } from 'react';
import './CardDisplay.scss';

interface ICardDisplayProps {
	children: ReactChild | ReactChild[];
}

const CardDisplay:FC<ICardDisplayProps> = (props) => {
	
	return (
		<div className="CardDisplay">
			
		</div>
	);
	
};

export default CardDisplay;