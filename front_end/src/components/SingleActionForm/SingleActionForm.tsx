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
				
			</form>
		</div>
	);
	
};

export default SingleActionForm;