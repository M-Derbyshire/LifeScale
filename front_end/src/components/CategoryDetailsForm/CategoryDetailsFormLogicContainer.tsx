import React, { Component } from 'react';
import CategoryDetailsForm from './CategoryDetailsForm';
import ActionsFormLogicContainer from '../ActionsForm/ActionsFormLogicContainer';
import IUserService from '../../interfaces/api_access/IUserService';
import ICategory from '../../interfaces/ICategory';
import IScale from '../../interfaces/IScale';


interface ICategoryDetailsFormLogicContainerProps {
	scaleID:string;
	categoryID?:string; //If undefined, this form will be used to create. Otherwise, form will update
	userService:IUserService;
	backButtonHandler:()=>void;
	onSuccessfulDeleteHandler?:()=>void;
};

interface ICategoryDetailsFormLogicContainerState {
	category:ICategory;
	categoryNameForHeading:string; // This is stored seperately, as changing the state.category.name 
									//would also change the heading otherwise
	scale?:IScale;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
	badLoadErrorMessage?:string;
};


export default class CategoryDetailsFormLogicContainer
	extends Component<ICategoryDetailsFormLogicContainerProps, ICategoryDetailsFormLogicContainerState>
{
	
	stdScaleLoadErrorMessage = "Unable to load the requested scale.";
	stdCategoryLoadErrorMessage = "Unable to load the requested category.";
	
	
	constructor(props:ICategoryDetailsFormLogicContainerProps)
	{
		super(props)
		
		let badLoadErrorMessage;
		
		const category = this.loadOrCreateCategory(this.props.categoryID);
		
		//empty string is falsy
		if(!category.id && this.props.categoryID)
				badLoadErrorMessage = this.stdCategoryLoadErrorMessage;
		
		
		const scale = this.props.userService.getScale(this.props.scaleID);
		if(!scale)
			badLoadErrorMessage = this.stdScaleLoadErrorMessage;
		
		
		this.state = {
			category: category,
			categoryNameForHeading: category!.name,
			scale, //may be undefined
			badLoadErrorMessage //may be undefined
		};
	}
	
	
	
	//If can't load a category, creates an empty one (no ID, for creating)
	loadOrCreateCategory(categoryID?:string):ICategory
	{
		//getCategory may return undefined
		let category:ICategory|undefined = (categoryID) 
							? this.props.userService.getCategory(categoryID!, this.props.scaleID) 
							: undefined;
		
		if(!category)
			category = { id:"", name: "", color: "red", desiredWeight: 1, actions: [] };
		
		return category;
	}
	
	
	
	
	createCategoryHandler()
	{
		//Bad load message prop to be passed to form, if scale isn't there (category gets set to blank if none)
		if(this.state.scale && this.state.category)
		{
			//The state category can have an ID, so for future safety's sake, we're 
			//creating the new obect with the values
			const category = this.state.category;
			
			this.props.userService.createCategory(this.state.scale, {
				name: category.name,
				color: category.color,
				desiredWeight: category.desiredWeight,
				actions: category.actions
			})
				.then(newCategory => this.setState({ 
					category: newCategory, 
					categoryNameForHeading: newCategory.name 
				}))
				.catch(err => {});
		}
		
	}
	
	
	
	
	render()
	{
		const isCreating = (!this.state.category.id);
		
		let actionsForm;
		if (!isCreating) 
			actionsForm = (<ActionsFormLogicContainer 
								userService={this.props.userService}
								scaleID={this.props.scaleID}
								categoryID={this.state.category!.id}
								onCategoryLoadError={()=>this.setState({ 
									badLoadErrorMessage: this.stdCategoryLoadErrorMessage 
								})}
							/>);
		
		
		let headingText = "";
		if(this.state.badLoadErrorMessage) 
			headingText = "Error";
		else if (!isCreating)
			headingText = `Edit Category - ${this.state.categoryNameForHeading}`;
		else
			headingText = "Create Category";
		
		
		
		return (
			<div className="CategoryDetailsFormLogicContainer">
				<CategoryDetailsForm
					categoryItem={{
						
						name: this.state.category.name,
						setName:(name:string) => this.setState({ 
							category: { ...this.state.category, name } 
						}),
						
						color: this.state.category.color,
						setColor:(color:string) => this.setState({ 
							category: { ...this.state.category, color } 
						}),
						
						desiredWeight: this.state.category.desiredWeight,
						setDesiredWeight:(desiredWeight:number) => this.setState({ 
							category: { ...this.state.category, desiredWeight } 
						}),
						
						onSubmit: (isCreating) ? this.createCategoryHandler.bind(this) : ()=>{},
						onDelete:(isCreating) ? undefined : ()=>{},
						badSaveErrorMessage: undefined,
						goodSaveMessage: undefined
						
					}}
					headingText={headingText}
					badLoadErrorMessage={this.state.badLoadErrorMessage}
					backButtonHandler={this.props.backButtonHandler}
					disableSubmit={undefined}
					actionsForm={actionsForm} />
			</div>
		);
	}
	
}