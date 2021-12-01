import React, { Component, ReactElement } from 'react';
import './ScaleBalanceDisplay.scss';

interface IScaleItem {
	label:string;
	weight:number;
	color:string;
}

interface IScaleBalanceDisplayProps {
	scaleItems:IScaleItem[];
}


class ScaleBalanceDisplay extends Component<IScaleBalanceDisplayProps> {
	
	
	
	render()
	{
		
		return (
			<div className="ScaleBalanceDisplay">
				
			</div>
		);
	}
	
}


export default ScaleBalanceDisplay;
export type { IScaleItem };