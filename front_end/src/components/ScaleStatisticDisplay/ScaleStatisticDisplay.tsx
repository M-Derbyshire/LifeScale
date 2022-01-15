import React, { FC } from 'react';
import './ScaleStatisticDisplay.scss';
import { mapPercentageStatisticToLi } from '../PercentageStatistic/PercentageStatistic';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';


interface IScaleStatisticDisplayProps {
	statistics:IPercentageStatistic[];
	amendHistoryCallback:()=>void; // The callback for the amend history button
}


/*
	Displays statistic percentage data for categories/actions. Also has a button to go to the page to 
	amend the action history for this scale
*/
const ScaleStatisticDisplay:FC<IScaleStatisticDisplayProps> = (props) => {
	
	
	return (
		<div className="ScaleStatisticDisplay">
			
			<header>
				<h2>Action Statistics</h2>
			</header>
			
			<ul>
				{props.statistics.map(mapPercentageStatisticToLi)}
			</ul>
			
			
		</div>
	);
	
};

export default ScaleStatisticDisplay;