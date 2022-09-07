import React, { FC, ReactElement } from 'react';
import './CategoryDetailsFormPartial.scss';
import ICategoryColorData from '../../interfaces/UI/ICategoryColorData';

interface ICategoryDetailsFormPartialProps {
	name:string;
	setName:(name:string)=>void;
	color:string;
	setColor:(color:string)=>void;
	desiredWeight:number;
	setDesiredWeight:(weight:number)=>void;
	colorList:ICategoryColorData[];
}


// map ICategoryColorData to an <option> element
const mapColorDataToOptionElement = (color:ICategoryColorData):ReactElement => {
	
	return (
		<option value={color.colorRealValue} key={color.colorRealValue}>
			{color.colorLabel}
		</option>
	);
	
}



/*
	Used to display and set basic category details (not including setting actions)
*/
const CategoryDetailsFormPartial:FC<ICategoryDetailsFormPartialProps> = (props) => {
	
	//If the provided color is empty, this means it was invalid,
	//and needs setting to the first as default (if no colors 
	//are provided, there's a bigger problem somewhere, so we'll 
	//just leave blank in that case).
	const realCategoryColorValue = 
		(props.color === "" && props.colorList.length > 0) ? props.colorList[0].colorRealValue : props.color;
	
	return (
		<div className="CategoryDetailsFormPartial">
			
			<label>
				Name: <input 
						className="categoryNameInput" 
						data-test="categoryNameInput"
						type="text" 
						required
						value={props.name} 
						onChange={(e)=>props.setName(e.target.value)} />
			</label>
			<br/>
			
			<label className="categoryColorInputLabel">
				Color: <select 
							required
							data-test="categoryColorSelect"
							style={{ borderColor: realCategoryColorValue }}
							className="categoryColorInput" 
							value={realCategoryColorValue} 
							onChange={(e)=>props.setColor(e.target.value)}>
								{props.colorList.map(mapColorDataToOptionElement)}
						</select>
			</label>
			<br/>
			
			<label>
				Desired Weight: <input 
					type="number" 
					required
					className="categoryDesiredWeightInput" 
					data-test="categoryDesiredWeightInput"
					min="0" 
					step="1"
					value={props.desiredWeight} 
					onChange={(e)=>props.setDesiredWeight( (Number(e.target.value) < 0) ? 0 : Math.round(Number(e.target.value)) )} />
			</label>
			
		</div>
	);
	
};

export default CategoryDetailsFormPartial;