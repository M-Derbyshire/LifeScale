import React, { FC } from 'react';
import './SingleActionForm.scss';


interface ISingleActionFormProps {
	name:string;
	setName:(name:string)=>void;
	weight:number;
	setWeight:(weight:number)=>void;
	onSubmit:()=>void;
	onDelete?:()=>void;
}

/*
	Used to display and save an action (not a usage of an action, but the details of the action-type itself)
*/
const SingleActionForm:FC<ISingleActionFormProps> = (props) => {
	
	return (
		<div className="SingleActionForm">
			<form onSubmit={props.onSubmit}>
				
				<label>
					Name: <input type="text" className="singleActionNameInput" value={props.name} onChange={(e)=>props.setName(e.target.value)} />
				</label>
				<br/>
				
				<label>
					Weight: <input 
						type="number" 
						className="singleActionWeightInput" 
						min="0" 
						step="1"
						value={props.weight} 
						onChange={(e)=>props.setWeight( (Number(e.target.value) < 0) ? 0 : Math.round(Number(e.target.value)) )} />
				</label>
				<br/>
				
				<input type="submit" value="Save" />
				{props.onDelete && <button onClick={props.onDelete}>Delete</button>}
				
			</form>
		</div>
	);
	
};

export default SingleActionForm;