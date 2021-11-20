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
			
		</div>
	);
	
};


export default ScaleDetailsFormPartial;