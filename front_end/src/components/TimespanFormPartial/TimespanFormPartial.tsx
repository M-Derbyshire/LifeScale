import React, { FC } from 'react';

interface ITimespanFormPartialProps {
	minutes:number;
	setMinutes:(minutes:number)=>void;
}


/*
	Used to display and set an amount of time (in minutes). This will also provide the ability to set it in hours 
	(however the component will still pass back up the value in minutes)
*/
const TimespanFormPartial:FC<ITimespanFormPartialProps> = (props) => {
	
	return (
		<div className="TimespanFormPartial">
			
		</div>
	);
	
};


export default TimespanFormPartial;