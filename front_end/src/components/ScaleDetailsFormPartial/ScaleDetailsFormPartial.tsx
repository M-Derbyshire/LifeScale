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
	Used to display and set basic scale details (not including setting categories)
*/
const ScaleDetailsFormPartial:FC<IScaleDetailsFormPartialProps> = (props) => {
	
	return (
		<div className="ScaleDetailsFormPartial">
			
			<label>
				Name: <input 
						className="scaleNameInput" 
						type="text" 
						value={props.name} 
						onChange={(e)=>props.setName(e.target.value)} />
			</label>
			<br/>
			
			<label>
				Scale Day Count: <input 
					type="number" 
					className="scaleDayCountInput" 
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
					checked={props.usesTimespans}
					onChange={(e)=>props.setUsesTimespans(e.target.checked)} /> Scale Actions should have timespans?
			</label>
			
		</div>
	);
	
};


export default ScaleDetailsFormPartial;