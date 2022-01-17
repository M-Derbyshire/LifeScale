import React, { FC } from 'react';
import './EmptyContentMessage.scss';

interface IEmptyContentMessageProps {
	message:string;
}


const EmptyContentMessage:FC<IEmptyContentMessageProps> = (props) => {
	
	
	return (
		<div className="EmptyContentMessage">
			<span>{props.message}</span>
		</div>
	);
	
};

export default EmptyContentMessage;