import React, { FC } from 'react';
import './ScalePrimaryDisplay.scss';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';
import ScaleBalanceDisplay from '../ScaleBalanceDisplay/ScaleBalanceDisplay';

interface IScalePrimaryDisplayProps {
	desiredBalanceItems:IScaleBalanceItem[];
	currentBalanceItems:IScaleBalanceItem[];
	editScaleCallback:()=>void; //Called by the Edit Scale button
}


const ScalePrimaryDisplay:FC<IScalePrimaryDisplayProps> = (props) => {
	
	
	return (
		<div className="ScalePrimaryDisplay">
			
			<div className="balanceScalesContainer">
				<div className="desiredBalanceContainer">
					<h2>Desired Balance</h2>
					<ScaleBalanceDisplay scaleItems={props.desiredBalanceItems} />
				</div>
				
				<div className="currentBalanceContainer">
					<h2>Current Balance</h2>
					<ScaleBalanceDisplay scaleItems={props.currentBalanceItems} />
				</div>
			</div>
			
		</div>
	);
	
};

export default ScalePrimaryDisplay;