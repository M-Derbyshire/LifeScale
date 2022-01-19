import React, { FC, ReactChild } from 'react';
import './NavigatableContentWrapper.scss';


interface INavigatableContentWrapperProps {
	children?:ReactChild|ReactChild[];
	navigationBar:ReactChild;
	smallSreenWidthPixels:number;
}


const NavigatableContentWrapper:FC<INavigatableContentWrapperProps> = (props) => {
	
	
	return (
		<div className="NavigatableContentWrapper">
			
		</div>
	);
	
};

export default NavigatableContentWrapper;