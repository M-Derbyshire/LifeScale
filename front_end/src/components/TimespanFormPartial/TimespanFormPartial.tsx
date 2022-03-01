import React, { FC, useState } from 'react';

interface ITimespanFormPartialProps {
	minutes:number;
	setMinutes:(minutes:number)=>void;
	
	//The minute/hour inputs of the RecordActionForm may need to temporarily by an invalid number (such 
	//as an empty string). Therefore, these should be updated with every state change, whereas the timespan's
	//minute value should only be updated when the input is a valid number.
	minuteDisplayValue:string;
	setMinuteDisplayValue:(value:string)=>void;
	hourDisplayValue:string;
	setHourDisplayValue:(value:string)=>void;
}


/*
	Used to display and set an amount of time (in minutes). This will also provide the ability to set it in hours 
	(however the component will still pass back up the value in minutes)
*/
const TimespanFormPartial:FC<ITimespanFormPartialProps> = (props) => {
	
	
	//Number type inputs can be an issue with react. Also tried external modules, but didn't work in the way we wanted
	//Instead, will use a regex and validation on text inputs. Also, using the minute/hour display props to allow for things such as 
	//empty values in the fields (if input value is valid, the minute state is set. Otherwise, only the display value is set).
	//The form should then fail to submit, if correctlly formatted data is not provided.
	const validNumberPattern = "[0-9]+\.?[0-9]{0,2}"; //up to 2 decimal places
	
	const customNumberValidationMessage = "Please provide a valid number";
	
	
	return (
		<div className="TimespanFormPartial">
			
			<label>
				Time spent (in minutes): <input 
					type="text"
					className="timespanMinuteInput"
					pattern={validNumberPattern}
					value={props.minuteDisplayValue}
					size={6}
					onChange={(e) => {
						if(e.target.validity.valid)
						{
							const minutes = Number(e.target.value);
							props.setMinutes(minutes);
							props.setHourDisplayValue((minutes / 60).toFixed(2));
						}
						else
							props.setHourDisplayValue("");
						
						props.setMinuteDisplayValue(e.target.value);
					}} />
			</label>
			
			<label>
				Time spent (in hours): <input 
					type="text"
					className="timespanHourInput"
					pattern={validNumberPattern}
					value={props.hourDisplayValue}
					size={6}
					onChange={(e) => {
						if(e.target.validity.valid)
						{
							const minutes = Number(e.target.value) * 60;
							props.setMinutes(minutes);
							props.setMinuteDisplayValue(minutes.toFixed(0));
						}
						else
							props.setMinuteDisplayValue("");
						
						props.setHourDisplayValue(e.target.value);
					}} />
			</label>
			
		</div>
	);
	
};


export default TimespanFormPartial;