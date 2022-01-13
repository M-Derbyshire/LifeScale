import React, { FC } from 'react';
import './ActionStatistic.scss';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';

interface IActionStatisticProps {
	statistic: IPercentageStatistic;
}

/*
	Used to display percentage information for actions that the user has recorded (say, what 
	percentage of events on a scale are of the action type in question)
*/
const ActionStatistic:FC<IActionStatisticProps> = (props) => {
	
	return (
		<div className="ActionStatistic">
			<span className="statisticLabel">{props.statistic.label}: </span>
			<span className="statisticPercentage">{props.statistic.percentage}%</span>
		</div>
	);
	
};

export default ActionStatistic;