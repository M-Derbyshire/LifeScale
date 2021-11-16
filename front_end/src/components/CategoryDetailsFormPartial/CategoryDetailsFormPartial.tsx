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
			
			<label>
				Name: <input 
						className="categoryNameInput" 
						type="text" 
						value={props.name} 
						onChange={(e)=>props.setName(e.target.value)} />
			</label>
			<br/>
			
		</div>
	);
	
};

export default CategoryDetailsFormPartial;