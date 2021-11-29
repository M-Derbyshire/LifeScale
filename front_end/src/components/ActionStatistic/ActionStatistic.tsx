import React, { FC } from 'react';
import './ActionStatistic.scss';

interface IActionStatisticProps {
	label:string;
	percentage:number;
}


const ActionStatistic:FC<IActionStatisticProps> = (props) => {
	
	return (
		<div className="ActionStatistic">
			<span className="actionLabel">{props.label}: </span>
			<span className="actionPercentage">{props.percentage}%</span>
		</div>
	);
	
};

export default ActionStatistic;