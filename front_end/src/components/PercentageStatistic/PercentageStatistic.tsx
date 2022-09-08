import React, { FC, ReactElement } from 'react';
import './PercentageStatistic.scss';
import IPercentageStatistic from '../../interfaces/UI/IPercentageStatistic';

interface IPercentageStatisticProps {
	statistic: IPercentageStatistic;
}

// Map IPercentageStatistic to <li>
const mapPercentageStatisticToLi = (child:IPercentageStatistic):ReactElement => (<li key={child.id}>
	<PercentageStatistic statistic={child} />
</li>);



/*
	Used to display percentage information for actions/categories/etc that the user has recorded (for example, what percentage of events on a 
	scale are of a particular action type)
*/
const PercentageStatistic:FC<IPercentageStatisticProps> = (props) => {
	
	return (
		<div className="PercentageStatistic">
			<span className="statisticLabel">{props.statistic.label}: </span>
			<span className="statisticPercentage" test-data="actionStatisticDisplayPercentage">{+props.statistic.percentage.toFixed(2)}%</span>
			
			{props.statistic.children && <ul className="statisticChildren">
				{props.statistic.children.map(mapPercentageStatisticToLi)}
			</ul>}
		</div>
	);
	
};

export default PercentageStatistic;
export { mapPercentageStatisticToLi };