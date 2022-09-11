import React, { FC } from 'react';
import './ScalePrimaryDisplay.scss';
import IScaleBalanceItem from '../../interfaces/UI/IScaleBalanceItem';
import ScaleBalanceDisplay from './ScaleBalanceDisplay/ScaleBalanceDisplay';

interface IScalePrimaryDisplayProps {
	desiredBalanceItems:IScaleBalanceItem[];
	currentBalanceItems:IScaleBalanceItem[];
	editScaleCallback:()=>void; //Called by the Edit Scale button
}


/*
	Used to display the "desired balance" scale, and the "current balance" scale. Also provides a button 
	that will take the user to the screen where they can edit the scale details.
*/
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
			
			<div className="scaleButtonsContainer">
				<button className="editScaleButton" data-test="scaleEditButton" onClick={props.editScaleCallback}>Edit Scale</button>
			</div>
			
		</div>
	);
	
};

export default ScalePrimaryDisplay;