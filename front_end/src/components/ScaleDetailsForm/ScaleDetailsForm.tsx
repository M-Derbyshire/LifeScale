import React, { FC } from 'react';
import './ScaleDetailsForm.scss';
import IScaleFormItem from '../../interfaces/UI/IScaleFormItem';

interface IScaleDetailsFormProps {
	scaleItem?:IScaleFormItem;
	
	headingText:string;
	badLoadErrorMessage?:string;
	
	backButtonHandler:()=>void;
	disableSubmit?:boolean;
}



const ScaleDetailsForm:FC<IScaleDetailsFormProps> = (props) => {
	
	
	return (
		<div className="ScaleDetailsForm">
			
			<header>
				<h1>{props.headingText}</h1>
			</header>
			
		</div>
	);
	
};

export default ScaleDetailsForm;