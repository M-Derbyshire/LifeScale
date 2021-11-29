import React, { FC } from 'react';
import './ActionStatistic.scss';

interface IActionStatisticProps {
	label:string;
	percentage:number;
}


const ActionStatistic:FC<IActionStatisticProps> = (props) => {
	
	return (
		<div className="ActionStatistic">
			
		</div>
	);
	
};

export default ActionStatistic;