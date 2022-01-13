import React, { FC } from 'react';
import './PercentageStatistic.scss';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';

interface IPercentageStatisticProps {
	statistic: IPercentageStatistic;
}

/*
	Used to display percentage information for actions that the user has recorded (say, what 
	percentage of events on a scale are of the action type in question)
*/
const PercentageStatistic:FC<IPercentageStatisticProps> = (props) => {
	
	return (
		<div className="PercentageStatistic">
			<span className="statisticLabel">{props.statistic.label}: </span>
			<span className="statisticPercentage">{props.statistic.percentage}%</span>
		</div>
	);
	
};

export default PercentageStatistic;