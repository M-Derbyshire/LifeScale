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



/*
	Used to display and set a range of timespans. The times are provided/set as Date objects (when setting state, 
	the original state's date will be used as the date, and the new time as the time)
*/
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
			
			<br/>
			
			<label>
				To: <input 
						type="time" 
						className="endTimeInput" 
						value={getFormattedTimeStamp(props.startTime)}
						onChange={(e) => props.setEndTime(constructDateTimeStamp(props.endTime, e.target.value))} />
			</label>
			
		</div>
	);
	
};


export default TimespanFormPartial;