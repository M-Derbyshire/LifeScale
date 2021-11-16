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
			
			<label>
				Color: <select 
						className="categoryColorInput" 
						value={props.color} 
						onChange={(e)=>props.setColor(e.target.value)}>
							<option value="red">Red</option>
							<option value="green">Green</option>
							<option value="blue">Blue</option>
							<option value="cyan">Cyan</option>
							<option value="yellow">Yellow</option>
							<option value="pink">Pink</option>
							<option value="purple">Purple</option>
							<option value="orange">Orange</option>
						</select>
			</label>
			<br/>
			
		</div>
	);
	
};

export default CategoryDetailsFormPartial;