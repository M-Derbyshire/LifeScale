import React, { FC } from 'react';

interface IScaleDetailsFormPartialProps {
	name:string;
	setName:(name:string)=>void;
	usesTimespans:boolean;
	setUsesTimespans:(usesTimespans:boolean)=>void;
	dayCount:number;
	setDayCount:(dayCount:number)=>void;
}


/*
	Used to display and set basic scale details (doesn't including updating/creating categories).
	See ScaleDetailsForm and ScaleDetailsFormLogicContainer components for logic of this.
*/
const ScaleDetailsFormPartial:FC<IScaleDetailsFormPartialProps> = (props) => {
	
	return (
		<div className="ScaleDetailsFormPartial">
			
			<label>
				Name: <input 
						className="scaleNameInput" 
						data-test="scaleNameInput"
						required
						type="text" 
						value={props.name} 
						onChange={(e)=>props.setName(e.target.value)} />
			</label>
			<br/>
			
			<label>
				Scale Day Count: <input 
					type="number" 
					className="scaleDayCountInput" 
					data-test="scaleDayCountInput"
					required
					min="0" 
					step="1"
					value={props.dayCount} 
					onChange={(e)=>props.setDayCount( (Number(e.target.value) < 0) ? 0 : Math.round(Number(e.target.value)) )} />
			</label>
			<br/>
			
			<label>
				<input 
					type="checkBox" 
					className="scaleUsesTimespansInput"
					data-test="scaleUsesTimespansInput"
					checked={props.usesTimespans}
					onChange={(e)=>props.setUsesTimespans(e.target.checked)} /> Scale Actions should have timespans?
			</label>
			
		</div>
	);
	
};


export default ScaleDetailsFormPartial;