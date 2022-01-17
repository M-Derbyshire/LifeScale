import React, { FC } from 'react';
import './ScalePrimaryDisplay.scss';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';

interface IScalePrimaryDisplayProps {
	desiredBalanceItems:IScaleBalanceItem[];
	currentBalanceItems:IScaleBalanceItem[];
	editScaleCallback:()=>void; //Called by the Edit Scale button
}


const ScalePrimaryDisplay:FC<IScalePrimaryDisplayProps> = (props) => {
	
	
	return (
		<div className="ScalePrimaryDisplay">
			
		</div>
	);
	
};

export default ScalePrimaryDisplay;