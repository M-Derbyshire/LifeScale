import React, { Component } from 'react';
import CategoryDetailsForm from './CategoryDetailsForm';
import ActionsFormLogicContainer from '../ActionsForm/ActionsFormLogicContainer';
import IUserService from '../../interfaces/api_access/IUserService';
import ICategory from '../../interfaces/ICategory';


interface ICategoryDetailsFormLogicContainerProps {
	scaleID:string;
	categoryID?:string; //If undefined, this form will be used to create. Otherwise, form will update
	userService:IUserService;
	backButtonHandler:()=>void;
	onSuccessfulDeleteHandler?:()=>void;
};

interface ICategoryDetailsFormLogicContainerState {
	category:ICategory|Omit<ICategory, "id">;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
};


export default class CategoryDetailsFormLogicContainer
	extends Component<ICategoryDetailsFormLogicContainerProps, ICategoryDetailsFormLogicContainerState>
{
	
	constructor(props:ICategoryDetailsFormLogicContainerProps)
	{
		super(props)
		
		
		//getCategory may return undefined
		let category:ICategory|Omit<ICategory, "id">|undefined = (this.props.categoryID) 
							? this.props.userService.getCategory(this.props.categoryID!, this.props.scaleID) 
							: undefined;
		
		if(!category)
			category = { name: "", color: "red", desiredWeight: 1, actions: [] };
		
		
		this.state = {
			category: category!
		};
	}
	
	
	
	render()
	{
		const isCreating = (!this.props.categoryID);
		
		const actionsForm = (!isCreating) ? (<ActionsFormLogicContainer 
															userService={this.props.userService}
															scaleID={this.props.scaleID}
															categoryID={this.props.categoryID!}
															onCategoryLoadError={()=>{}}
														/>) : undefined;
		
		
		let headingText = "";
		if(!this.state.category) 
			headingText = "Error";
		else if (!isCreating)
			headingText = `Edit Category - ${this.state.category!.name}`;
		else
			headingText = "Create Category";
		
		
		
		return (
			<div className="CategoryDetailsFormLogicContainer">
				<CategoryDetailsForm
					categoryItem={{
						name: "test",
						setName:(name:string)=>{},
						color: "red",
						setColor:(color:string)=>{},
						desiredWeight: 1,
						setDesiredWeight:(weight:number)=>{},
						onSubmit:()=>{},
						onDelete:(isCreating) ? undefined : ()=>{},
						badSaveErrorMessage: undefined,
						goodSaveMessage: undefined
					}}
					headingText={headingText}
					badLoadErrorMessage={undefined}
					backButtonHandler={()=>{}}
					disableSubmit={undefined}
					actionsForm={actionsForm} />
			</div>
		);
	}
	
}