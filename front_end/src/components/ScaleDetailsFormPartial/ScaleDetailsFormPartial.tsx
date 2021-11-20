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
			
		</div>
	);
	
};


export default ScaleDetailsFormPartial;