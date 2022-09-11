import React, { FC } from 'react';
import './SingleActionForm.scss';
import BadSaveMessage from '../../../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../../../SaveMessage/GoodSaveMessage';


interface ISingleActionFormProps {
	name:string;
	setName:(name:string)=>void;
	weight:number;
	setWeight:(weight:number)=>void;
	onSubmit:()=>void;
	onDelete?:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}

/*
	Used to display and create/update an action (not a usage of the action, but the details of the action entity itself).
	See ActionsForm and ActionsFormLogicContainer components for more information on usage/logic
*/
const SingleActionForm:FC<ISingleActionFormProps> = (props) => {
	
	return (
		<div className="SingleActionForm" data-test="singleActionForm">
			<form onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
				
				<label>
					Name: <input 
							type="text" 
							required 
							className="singleActionNameInput" 
							data-test="actionNameInput"
							value={props.name} 
							onChange={(e)=>props.setName(e.target.value)} />
				</label>
				<br/>
				
				<label>
					Weight: <input 
								type="number" 
								required
								className="singleActionWeightInput" 
								data-test="actionWeightInput"
								min="0" 
								step="1"
								value={props.weight} 
								onChange={(e)=>props.setWeight( (Number(e.target.value) < 0) ? 0 : Math.round(Number(e.target.value)) )} />
				</label>
				<br/>
				
				{props.badSaveErrorMessage && 
							<BadSaveMessage message={props.badSaveErrorMessage} />}
				{props.goodSaveMessage && 
							<GoodSaveMessage message={props.goodSaveMessage} />}
				
				
				<input type="submit" data-test="actionSaveBtn" value="Save" />
				{props.onDelete && <button type="button" data-test="actionDeleteBtn" onClick={props.onDelete}>Delete</button>} 
				
			</form>
		</div>
	);
	
};

export default SingleActionForm;