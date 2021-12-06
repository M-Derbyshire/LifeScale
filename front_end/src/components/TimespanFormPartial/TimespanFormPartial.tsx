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
			
			<label>
				Time spent (in minutes): <input 
					type="number"
					className="timespanMinuteInput"
					step="1"
					min="0"
					max="1440" //Total minutes in a day
					value={props.minutes}
					onChange={(e) => props.setMinutes( (Number(e.target.value) < 0) ? 0 : Math.round(Number(e.target.value)) )} />
			</label>
			
		</div>
	);
	
};


export default TimespanFormPartial;