import React, { FC, ReactElement } from 'react';
import './CategoryDetailsForm.scss';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import CategoryDetailsFormPartial from '../CategoryDetailsFormPartial/CategoryDetailsFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';
import ICategoryFormItem from '../../interfaces/UI/ICategoryFormItem';
import ICategoryColorData from '../../interfaces/UI/ICategoryColorData';


interface ICategoryDetailsFormProps {
	categoryItem?:ICategoryFormItem;
	
	colorList:ICategoryColorData[];
	
	headingText:string;
	badLoadErrorMessage?:string;
	
	backButtonHandler:()=>void;
	disableSubmit?:boolean;
	
	actionsForm?:ReactElement; //The form component used to add actions (this may not be given, if we're creating a category instead of updating)
}

/*
	This is used to create and edit categories in the system. The container component should handle the logic
*/
const CategoryDetailsForm:FC<ICategoryDetailsFormProps> = (props) => {
	
	return (
		<div className="CategoryDetailsForm">
			
			<header>
				<h1>{props.headingText}</h1>
				<button className="categoryBackButton" onClick={props.backButtonHandler}>Back</button>
			</header>
			
			<LoadedContentWrapper errorMessage={props.badLoadErrorMessage} render={props.categoryItem && 
				<div>
					<form onSubmit={(e) => { e.preventDefault(); props.categoryItem!.onSubmit(); } }>
						
						<CategoryDetailsFormPartial 
							name={props.categoryItem.name}
							setName={props.categoryItem.setName}
							color={props.categoryItem.color}
							setColor={props.categoryItem.setColor}
							desiredWeight={props.categoryItem.desiredWeight}
							setDesiredWeight={props.categoryItem.setDesiredWeight}
							colorList={props.colorList} />
						
						
						{props.categoryItem.badSaveErrorMessage && 
							<BadSaveMessage message={props.categoryItem.badSaveErrorMessage} />}
						{props.categoryItem.goodSaveMessage && 
							<GoodSaveMessage message={props.categoryItem.goodSaveMessage} />}
						
						
						<input type="submit" value="Save" disabled={props.disableSubmit} />
						{props.categoryItem.onDelete && 
							<button 
								className="categoryDeleteButton" 
								type="button" 
								onClick={props.categoryItem.onDelete}>Delete</button>} 
						
					</form>
					
					{props.actionsForm}
					
				</div>
			} />
			
		</div>
	);
	
};

export default CategoryDetailsForm;