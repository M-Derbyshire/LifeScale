import React, { FC } from 'react';
import './CategoryDetailsForm.scss';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import CategoryDetailsFormPartial from '../CategoryDetailsFormPartial/CategoryDetailsFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';
import ICategoryFormItem from '../../interfaces/UI/ICategoryFormItem';


interface ICategoryDetailsFormProps {
	categoryItem?:ICategoryFormItem;
	
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
			
			<LoadedContentWrapper errorMessage={props.badLoadErrorMessage} render={props.categoryItem && 
				<form>
					
					<CategoryDetailsFormPartial 
						name={props.categoryItem.name}
						setName={props.categoryItem.setName}
						color={props.categoryItem.color}
						setColor={props.categoryItem.setColor}
						desiredWeight={props.categoryItem.desiredWeight}
						setDesiredWeight={props.categoryItem.setDesiredWeight} />
					
					
					
					{props.categoryItem.badSaveErrorMessage && 
						<BadSaveMessage message={props.categoryItem.badSaveErrorMessage} />}
					{props.categoryItem.goodSaveMessage && 
						<GoodSaveMessage message={props.categoryItem.goodSaveMessage} />}
					
				</form>
			} />
			
		</div>
	);
	
};

export default CategoryDetailsForm;