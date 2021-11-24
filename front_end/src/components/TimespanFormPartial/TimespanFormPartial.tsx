import React, { FC } from 'react';

interface ITimespanFormPartialProps {
	startTime:Date;
	endTime:Date;
	setStartTime:(date:Date)=>void;
	setEndTime:(date:Date)=>void;
}


const TimespanFormPartial:FC<ITimespanFormPartialProps> = (props) => {
	
	return (
		<div className="TimespanFormPartial">
			
		</div>
	);
	
};


export default TimespanFormPartial;