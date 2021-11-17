import React, { FC } from 'react';

interface ICategoryDetailsFormPartialProps {
	name:string;
	setName:(name:string)=>void;
	color:string;
	setColor:(color:string)=>void;
	desiredWeight:number;
	setDesiredWeight:(weight:number)=>void;
}

/*
	Used to display and set basic category details (not including setting actions)
*/
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
			
			<label>
				Desired Weight: <input 
					type="number" 
					className="categoryDesiredWeightInput" 
					min="0" 
					step="1"
					value={props.desiredWeight} 
					onChange={(e)=>props.setDesiredWeight( (Number(e.target.value) < 0) ? 0 : Math.round(Number(e.target.value)) )} />
			</label>
			
		</div>
	);
	
};

export default CategoryDetailsFormPartial;