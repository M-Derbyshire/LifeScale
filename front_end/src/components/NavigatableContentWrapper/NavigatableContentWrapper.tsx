import React, { FC, ReactChild, useState, useEffect } from 'react';
import './NavigatableContentWrapper.scss';
import DropdownContentBar from '../DropdownContentBar/DropdownContentBar';


interface INavigatableContentWrapperProps {
	children?:ReactChild|ReactChild[];
	navigationBar:ReactChild;
	smallScreenWidthPixels:number; // The width value (in pixels) that is considered a small viewport
}

/*
	Used when you want to render content that will be navigatable, and responsive. You provide the navigation 
	bar in the navigationBar prop, and then provide the rest of the content as children. This component 
	will then render these, in a responsive layout (based on the given smallScreenWidthPixels).
*/
const NavigatableContentWrapper:FC<INavigatableContentWrapperProps> = (props) => {
	
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	
	useEffect(() => {
		
		const handleScreenResize = (e:any) => setScreenWidth(window.innerWidth);
		
		window.addEventListener("resize", handleScreenResize);
		return () => window.removeEventListener("resize", handleScreenResize);
		
	}, []);
	
	
	
	const isSmallScreen = props.smallScreenWidthPixels >= screenWidth;
	
	
	
	return (
		<div className="NavigatableContentWrapper">
			
			<div className={`wrapperContentContainer ${(isSmallScreen) ? "smallScreenWidth" : ""}`}>
			
				<div className="navigationBarContainer">
					{(isSmallScreen) ? 
						(<DropdownContentBar>{props.navigationBar}</DropdownContentBar>) : 
						props.navigationBar}
				</div>
				
				<div className="mainContentContainer">
					{props.children}
				</div>
				
			</div>
			
		</div>
	);
	
};

export default NavigatableContentWrapper;