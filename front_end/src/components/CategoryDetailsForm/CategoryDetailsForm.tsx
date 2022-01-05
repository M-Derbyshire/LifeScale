import React, { FC } from 'react';
import './CategoryDetailsForm.scss';
import ICategoryFormItem from '../../interfaces/UI/ICategoryFormItem';


interface ICategoryDetailsFormProps {
	categoryItem:ICategoryFormItem;
	
	headingText:string;
	badLoadErrorMessage?:string;
	
	backButtonHandler:()=>void;
	disableSubmit?:boolean;
}

const CategoryDetailsForm:FC<ICategoryDetailsFormProps> = (props) => {
	
	return (
		<div className="CategoryDetailsForm">
			
			<header>
				<h1>{props.headingText}</h1>
				<button className="categoryBackButton" onClick={props.backButtonHandler}>Back</button>
			</header>
			
		</div>
	);
	
};

export default CategoryDetailsForm;