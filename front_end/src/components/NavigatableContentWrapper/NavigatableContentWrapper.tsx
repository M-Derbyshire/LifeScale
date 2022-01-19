import React, { FC, ReactChild } from 'react';
import './NavigatableContentWrapper.scss';


interface INavigatableContentWrapperProps {
	children?:ReactChild|ReactChild[];
	navigationBar:ReactChild;
	smallScreenWidthPixels:number;
}


const NavigatableContentWrapper:FC<INavigatableContentWrapperProps> = (props) => {
	
	
	return (
		<div className="NavigatableContentWrapper">
			
			<div className="navigationBarContainer">
				{props.navigationBar}
			</div>
			
			<div className="mainContentContainer">
				{props.children}
			</div>
			
		</div>
	);
	
};

export default NavigatableContentWrapper;