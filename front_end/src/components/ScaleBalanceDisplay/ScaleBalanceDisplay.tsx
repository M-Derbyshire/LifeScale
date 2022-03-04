import React, { Component, ReactElement } from 'react';
import './ScaleBalanceDisplay.scss';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';


interface IScaleBalanceDisplayProps {
	scaleItems:IScaleBalanceItem[];
}

/*
	Used to display different items (say, categories) on a scale -- items take up more/less visual space
	based on how heavy their weight is (so more space for heavier, less for lighter).
*/
class ScaleBalanceDisplay extends Component<IScaleBalanceDisplayProps> {
	
	
	mapScaleItemToElement(scaleItem:IScaleBalanceItem):ReactElement
	{
		return (
			<div className="scaleBalanceItem" key={scaleItem.label} style={{
				backgroundColor: scaleItem.color,
				flexGrow: scaleItem.weight
			}}>
				<span>{scaleItem.label}</span>
			</div>
		);
	}
	
	
	render()
	{
		
		return (
			<div className="ScaleBalanceDisplay">
				{this.props.scaleItems.map(this.mapScaleItemToElement)}
			</div>
		);
	}
	
}


export default ScaleBalanceDisplay;