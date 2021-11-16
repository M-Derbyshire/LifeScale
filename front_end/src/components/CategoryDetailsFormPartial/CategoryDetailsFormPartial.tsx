import React, { FC } from 'react';

interface ICategoryDetailsFormPartialProps {
	name:string;
	setName:(name:string)=>void;
	color:string;
	setColor:(color:string)=>void;
	desiredWeight:number;
	setDesiredWeight:(weight:number)=>void;
}


const CategoryDetailsFormPartial:FC<ICategoryDetailsFormPartialProps> = (props) => {
	
	return (
		<div className="CategoryDetailsFormPartial">
			
		</div>
	);
	
};

export default CategoryDetailsFormPartial;