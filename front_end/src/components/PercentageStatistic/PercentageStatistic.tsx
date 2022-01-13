import React, { FC, ReactElement } from 'react';
import './PercentageStatistic.scss';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';

interface IPercentageStatisticProps {
	statistic: IPercentageStatistic;
}


const mapChildToLi = (child:IPercentageStatistic):ReactElement => (<li key={child.id}>
	<PercentageStatistic statistic={child} />
</li>);



/*
	Used to display percentage information for actions that the user has recorded (say, what 
	percentage of events on a scale are of the action type in question)
*/
const PercentageStatistic:FC<IPercentageStatisticProps> = (props) => {
	
	return (
		<div className="PercentageStatistic">
			<span className="statisticLabel">{props.statistic.label}: </span>
			<span className="statisticPercentage">{props.statistic.percentage}%</span>
			
			<ul className="statisticChildren">
				{props.statistic.children && props.statistic.children.map(mapChildToLi)}
			</ul>
		</div>
	);
	
};

export default PercentageStatistic;