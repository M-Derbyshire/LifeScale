import React, { FC } from 'react';

interface ITimespanFormPartialProps {
	startTime:Date;
	endTime:Date;
	setStartTime:(date:Date)=>void;
	setEndTime:(date:Date)=>void;
}


const getFormattedTimeStamp = (date:Date) => `${date.getHours()}:${date.getMinutes()}`;

const constructDateTimeStamp = (date:Date, timeStamp:string) => new Date(
	`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${timeStamp}`
);


const TimespanFormPartial:FC<ITimespanFormPartialProps> = (props) => {
	
	return (
		<div className="TimespanFormPartial">
			
			<label>
				From: <input 
							type="time" 
							className="startTimeInput" 
							value={getFormattedTimeStamp(props.startTime)}
							onChange={(e) => props.setStartTime(constructDateTimeStamp(props.startTime, e.target.value))} />
			</label>
			
		</div>
	);
	
};


export default TimespanFormPartial;