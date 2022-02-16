import React, { Component } from 'react';
import CategoryDetailsForm from './CategoryDetailsForm';
import ActionsFormLogicContainer from '../ActionsForm/ActionsFormLogicContainer';
import IUserService from '../../interfaces/api_access/IUserService';
import ICategory from '../../interfaces/ICategory';
import IScale from '../../interfaces/IScale';
import ICategoryColorData from '../../interfaces/UI/ICategoryColorData';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';


interface ICategoryDetailsFormLogicContainerProps {
	scaleID:string;
	categoryID?:string; //If undefined, this form will be used to create. Otherwise, form will update
	userService:IUserService;
	backButtonHandler:()=>void;
	onSuccessfulDeleteHandler?:()=>void;
	categoryColorProvider:CategoryColorProvider;
};

interface ICategoryDetailsFormLogicContainerState {
	category:ICategory;
	originalCategoryRef:ICategory; // used when updating/deleting (and to keep the original
									// header text during name change)
	scale?:IScale;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
	badLoadErrorMessage?:string;
	disableSubmit:boolean;
};


export default class CategoryDetailsFormLogicContainer
	extends Component<ICategoryDetailsFormLogicContainerProps, ICategoryDetailsFormLogicContainerState>
{
	
	stdScaleLoadErrorMessage = "Unable to load the requested scale.";
	stdCategoryLoadErrorMessage = "Unable to load the requested category.";
	
	stdGoodSaveMessage = "Category saved successfully.";
	
	colorList:ICategoryColorData[];
	
	constructor(props:ICategoryDetailsFormLogicContainerProps)
	{
		super(props)
		
		this.colorList = this.props.categoryColorProvider.getColorList();
		
		
		let badLoadErrorMessage;
		
		const categoryObjects = this.loadOrCreateCategory(this.props.categoryID);
		
		//empty string is falsy
		if(!categoryObjects.category.id && this.props.categoryID)
				badLoadErrorMessage = this.stdCategoryLoadErrorMessage;
		
		
		const scale = this.props.userService.getScale(this.props.scaleID);
		if(!scale)
			badLoadErrorMessage = this.stdScaleLoadErrorMessage;
		
		
		this.state = {
			category: categoryObjects.category,
			originalCategoryRef: categoryObjects.categoryRef,
			scale, //may be undefined
			badLoadErrorMessage, //may be undefined
			disableSubmit: false
		};
	}
	
	
	
	//If can't load a category, creates an empty one (no ID, for creating)
	//categoryRef is a reference to the original category. category is a spread of the reference
	loadOrCreateCategory(categoryID?:string):{ categoryRef:ICategory, category:ICategory }
	{
		//getCategory may return undefined
		let categoryRef:ICategory|undefined = (categoryID) 
							? this.props.userService.getCategory(categoryID!, this.props.scaleID) 
							: undefined;
		
		if(!categoryRef)
		{
			const defaultColor = (this.colorList.length > 0) ? this.colorList[0].colorName : "";
			categoryRef = { id:"", name: "", color: defaultColor, desiredWeight: 1, actions: [] };
		}
		
		const category = { ...categoryRef };
		
		
		return { category, categoryRef };
	}
	
	
	
	
	createCategoryHandler()
	{
		//Bad load message prop to be passed to form, if scale isn't there (category gets set to blank if none)
		if(this.state.scale)
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
					category: { ...newCategory }, 
					originalCategoryRef: category,
					goodSaveMessage: this.stdGoodSaveMessage,
					badSaveErrorMessage: undefined,
					disableSubmit: false
				}))
				.catch(err => this.setState({ 
					badSaveErrorMessage: err.message,
					goodSaveMessage: undefined,
					disableSubmit: false
				}));
			
			
			this.setState({
				disableSubmit: true
			});
		}
		
	}
	
	updateCategoryHandler()
	{
		this.props.userService.updateCategory(this.state.originalCategoryRef, this.state.category)
			.then(updatedCategory => this.setState({ 
				originalCategoryRef: updatedCategory,
				goodSaveMessage: this.stdGoodSaveMessage,
				badSaveErrorMessage: undefined,
				disableSubmit: false
			}))
			.catch(err => this.setState({ 
				badSaveErrorMessage: err.message,
				goodSaveMessage: undefined,
				disableSubmit: false
			}));
		
		
		this.setState({
			disableSubmit: true
		});
	}
	
	deleteCategoryHandler()
	{
		if(this.state.scale)
			this.props.userService.deleteCategory(this.state.scale, this.state.originalCategoryRef)
				.then(categories => {
					if(this.props.onSuccessfulDeleteHandler) 
						this.props.onSuccessfulDeleteHandler()
				})
				.catch(err => this.setState({ badSaveErrorMessage: err.message }));
	}
	
	
	
	
	render()
	{
		const isCreating = (!this.state.category.id);
		
		let actionsForm;
		if (!isCreating && this.state.scale) //If no scale, bad load message should be displayed anyway 
			actionsForm = (<ActionsFormLogicContainer 
								userService={this.props.userService}
								scale={this.state.scale!}
								category={this.state.category!}
							/>);
		
		
		let headingText = "";
		if(this.state.badLoadErrorMessage) 
			headingText = "Error";
		else if (!isCreating)
			headingText = `Edit Category - ${this.state.originalCategoryRef.name}`;
		else
			headingText = "Create Category";
		
		
		
		const onSubmit = 
			(isCreating) ? this.createCategoryHandler.bind(this) : this.updateCategoryHandler.bind(this);
		
		
		//Used to keep the value in the database consistent, even if the actual color changes
		let itemRealColor = this.props.categoryColorProvider.getRealColorFromName(this.state.category.color);
		if(!itemRealColor)
			itemRealColor = ""; //Empty value will be treated as not found by the form partial, and handled there
		
		
		return (
			<div className="CategoryDetailsFormLogicContainer">
				<CategoryDetailsForm
					categoryItem={{
						
						name: this.state.category.name,
						setName:(name:string) => this.setState({ 
							category: { ...this.state.category, name } 
						}),
						
						color: itemRealColor,
						setColor:(color:string) => 
						{
							//Used to keep the value in the database consistent, 
							//even if the actual color changes
							let colorName = this.props.categoryColorProvider.getNameFromRealColor(color);
							if(!colorName)
								colorName = "";
							
							this.setState({ 
								category: { 
									...this.state.category, 
									color: colorName
								} 
							});
						},
						
						desiredWeight: this.state.category.desiredWeight,
						setDesiredWeight:(desiredWeight:number) => this.setState({ 
							category: { ...this.state.category, desiredWeight } 
						}),
						
						onSubmit: onSubmit,
						onDelete:(isCreating) ? undefined : this.deleteCategoryHandler.bind(this),
						badSaveErrorMessage: this.state.badSaveErrorMessage,
						goodSaveMessage: this.state.goodSaveMessage
						
					}}
					colorList={this.colorList}
					headingText={headingText}
					badLoadErrorMessage={this.state.badLoadErrorMessage}
					backButtonHandler={this.props.backButtonHandler}
					disableSubmit={this.state.disableSubmit}
					actionsForm={actionsForm} />
			</div>
		);
	}
	
}