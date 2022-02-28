import React, { FC, useState } from 'react';

interface ITimespanFormPartialProps {
	minutes:number;
	setMinutes:(minutes:number)=>void;
}


/*
	Used to display and set an amount of time (in minutes). This will also provide the ability to set it in hours 
	(however the component will still pass back up the value in minutes)
*/
const TimespanFormPartial:FC<ITimespanFormPartialProps> = (props) => {
	
	
	//Number type inputs can be an issue with react. Also tried external modules, but didn't work in the way we wanted
	//Instead, will use a regex and validation on text inputs. Also, using the below state to allow for things such as 
	//empty values in the fields (if input value is valid, the minute state is set. Otherwise, only the display value is set).
	//The form should then fail to submit, if correctlly formatted data is not provided
	const validNumberPattern = "[0-9]+\.?[0-9]{0,2}"; //up to 2 decimal places
	const [minuteDisplayValue, setMinuteDisplayValue] = useState(props.minutes.toFixed(0));
	const [hourDisplayValue, setHourDisplayValue] = useState((props.minutes / 60).toFixed(2));
	
	const customNumberValidationMessage = "Please provide a valid number";
	
	
	return (
		<div className="TimespanFormPartial">
			
			<label>
				Time spent (in minutes): <input 
					type="text"
					className="timespanMinuteInput"
					pattern={validNumberPattern}
					value={minuteDisplayValue}
					onChange={(e) => {
						if(e.target.validity.valid)
						{
							const minutes = Number(e.target.value);
							props.setMinutes(minutes);
							setHourDisplayValue((minutes / 60).toFixed(2));
						}
						else
							setHourDisplayValue("");
						
						setMinuteDisplayValue(e.target.value);
					}} />
			</label>
			
			<label>
				Time spent (in hours): <input 
					type="text"
					className="timespanHourInput"
					pattern={validNumberPattern}
					value={hourDisplayValue}
					onChange={(e) => {
						if(e.target.validity.valid)
						{
							const minutes = Number(e.target.value) * 60;
							props.setMinutes(minutes);
							setMinuteDisplayValue(minutes.toFixed(0));
						}
						else
							setMinuteDisplayValue("");
						
						setHourDisplayValue(e.target.value);
					}} />
			</label>
			
		</div>
	);
	
};


export default TimespanFormPartial;