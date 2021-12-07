import React, { FC, ReactElement } from 'react';

interface ILoadedContentWrapperProps {
	render?:ReactElement;
	errorMessage?:string;
}


const LoadedContentWrapper:FC<ILoadedContentWrapperProps> = (props) => {
	
	
	return (
		<div className="LoadedContentWrapper">
			
		</div>
	);
	
};


export default LoadedContentWrapper;