import React, { FC } from 'react';
import './EmptyContentMessage.scss';

interface IEmptyContentMessageProps {
	message:string;
}

/*
	Displays the given message. To be used when there's no content to display
*/
const EmptyContentMessage:FC<IEmptyContentMessageProps> = (props) => {
	
	
	return (
		<div className="EmptyContentMessage">
			<span>{props.message}</span>
		</div>
	);
	
};

export default EmptyContentMessage;