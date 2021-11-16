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
	
	const nameInputElemId = "singleActionNameInput";
	
	return (
		<div className="SingleActionForm">
			<form>
				
				<label htmlFor={nameInputElemId}>Name: </label>
				<input type="text" className="singleActionNameInput" id={nameInputElemId} value={props.name} onChange={(e)=>props.setName(e.target.value)} />
				<br/>
				
			</form>
		</div>
	);
	
};

export default SingleActionForm;