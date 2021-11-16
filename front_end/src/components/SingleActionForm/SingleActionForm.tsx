import React, { FC } from 'react';
import './SingleActionForm.scss';


interface ISingleActionFormProps {
	name:string;
	setName:(name:string)=>void;
	weight:number;
	setWeight:(weight:number)=>void;
	onSubmit:()=>void;
}

const SingleActionForm:FC<ISingleActionFormProps> = (props) => {
	
	return (
		<div className="SingleActionForm">
			<form>
				
				<label>
					Name: <input type="text" className="singleActionNameInput" value={props.name} onChange={(e)=>props.setName(e.target.value)} />
				</label>
				<br/>
				
				<label>
					Weight: <input 
						type="number" 
						className="singleActionWeightInput" 
						min="0" 
						value={props.weight} 
						onChange={(e)=>props.setWeight( (Number(e.target.value) < 0) ? 0 : Number(e.target.value) )} />
				</label>
				
			</form>
		</div>
	);
	
};

export default SingleActionForm;