import React, { FC, ReactChild, useState, useEffect } from 'react';
import './NavigatableContentWrapper.scss';


interface INavigatableContentWrapperProps {
	children?:ReactChild|ReactChild[];
	navigationBar:ReactChild;
	smallScreenWidthPixels:number;
}


const NavigatableContentWrapper:FC<INavigatableContentWrapperProps> = (props) => {
	
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const handleScreenResize = (e:any) => setScreenWidth(window.innerWidth);
	
	useEffect(() => {
		
		window.addEventListener("resize", handleScreenResize);
		return () => window.removeEventListener("resize", handleScreenResize);
		
	}, []);
	
	const isSmallScreen = props.smallScreenWidthPixels >= screenWidth;
	
	
	
	return (
		<div className="NavigatableContentWrapper">
			
			<div className={`wrapperContentContainer ${(isSmallScreen) ? "smallScreenWidth" : ""}`}>
			
				<div className="navigationBarContainer">
					{props.navigationBar}
				</div>
				
				<div className="mainContentContainer">
					{props.children}
				</div>
				
			</div>
			
		</div>
	);
	
};

export default NavigatableContentWrapper;