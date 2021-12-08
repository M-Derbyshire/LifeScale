import React, { FC, ReactElement } from 'react';
import ErrorMessageDisplay from '../ErrorMessageDisplay/ErrorMessageDisplay';

interface ILoadedContentWrapperProps {
	render?:ReactElement;
	errorMessage?:string;
}


/*
	Used when you want to render something, but may not have all the data needed to render it yet.
	
	This will render a loading message or icon (this may change thoughout the life of the project), if 
	nothing is provided in the "render" prop.
	
	If the errorMessage prop is provided, that will be rendered instead
*/
const LoadedContentWrapper:FC<ILoadedContentWrapperProps> = (props) => {
	
	
	return (
		<div className="LoadedContentWrapper">
			
			{props.errorMessage && <ErrorMessageDisplay message={props.errorMessage} />}
			
			{props.render}
			
		</div>
	);
	
};


export default LoadedContentWrapper;