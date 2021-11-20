import React, { FC } from 'react';
import './ErrorMessageDisplay.scss';

interface IErrorMessageDisplayProps {
	message:string;
}

const ErrorMessageDisplay:FC<IErrorMessageDisplayProps> = (props) => {
	
	return (
		<div className="ErrorMessageDisplay">
			
		</div>
	);
	
};

export default ErrorMessageDisplay;