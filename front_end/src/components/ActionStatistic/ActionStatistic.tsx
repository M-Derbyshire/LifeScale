import React, { FC } from 'react';
import './ActionStatistic.scss';

interface IActionStatisticProps {
	label:string;
	percentage:number;
}

/*
	Used to display percentage information for actions that the user has recorded (say, what 
	percentage of events on a scale are of the action type in question)
*/
const ActionStatistic:FC<IActionStatisticProps> = (props) => {
	
	return (
		<div className="ActionStatistic">
			<span className="statisticLabel">{props.label}: </span>
			<span className="statisticPercentage">{props.percentage}%</span>
		</div>
	);
	
};

export default ActionStatistic;