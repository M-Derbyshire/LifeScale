import React, { FC } from 'react';
import './ErrorMessageDisplay.scss';

interface IErrorMessageDisplayProps {
	message:string;
}

const ErrorMessageDisplay:FC<IErrorMessageDisplayProps> = (props) => {
	
	return (
		<div className="ErrorMessageDisplay">
			<h1>An Error Has Occurred:</h1>
			<p>{props.message}</p>
		</div>
	);
	
};

export default ErrorMessageDisplay;