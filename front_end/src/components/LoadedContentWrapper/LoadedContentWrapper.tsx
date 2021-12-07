import React, { FC, ReactElement } from 'react';
import ErrorMessageDisplay from '../ErrorMessageDisplay/ErrorMessageDisplay';

interface ILoadedContentWrapperProps {
	render?:ReactElement;
	errorMessage?:string;
}


const LoadedContentWrapper:FC<ILoadedContentWrapperProps> = (props) => {
	
	
	return (
		<div className="LoadedContentWrapper">
			
			{props.errorMessage && <ErrorMessageDisplay message={props.errorMessage} />}
			
		</div>
	);
	
};


export default LoadedContentWrapper;