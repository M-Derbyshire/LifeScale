import React, { Component, ReactElement } from 'react';
import './ScaleBalanceDisplay.scss';

//ScaleItems represent an item (say, a category) to be placed on the scale
interface IScaleItem {
	label:string; //The name or title of the scale
	weight:number; //A number to represent the weight. 
					//This could be a percentage, a fraction, an int (as long as the type of number used is 
					//consistent for every item)
	color:string; //CSS color to be used for the item
}

interface IScaleBalanceDisplayProps {
	scaleItems:IScaleItem[];
}

/*
	Used to display different items (say, categories) on a scale -- items take up more/less visual space
	based on how heavy their weight is (so more space for heavier, less for lighter).
*/
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