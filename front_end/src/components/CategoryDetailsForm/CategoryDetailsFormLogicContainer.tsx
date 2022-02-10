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
	category:ICategory|Omit<ICategory, "id">;
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
		
		//getCategory may return undefined
		let category:ICategory|Omit<ICategory, "id">|undefined = (this.props.categoryID) 
							? this.props.userService.getCategory(this.props.categoryID!, this.props.scaleID) 
							: undefined;
		
		if(this.props.categoryID && !category)
		{
			badLoadErrorMessage = this.stdCategoryLoadErrorMessage;
			category = { name: "", color: "red", desiredWeight: 1, actions: [] };
		}
		
		
		
		const scale = this.props.userService.getScale(this.props.scaleID);
		if(!scale)
			badLoadErrorMessage = this.stdScaleLoadErrorMessage;
		
		
		this.state = {
			category: category!,
			scale, //may be undefined
			badLoadErrorMessage //may be undefined
		};
	}
	
	
	
	render()
	{
		const isCreating = (!this.props.categoryID);
		
		let actionsForm;
		if (!isCreating) 
			actionsForm = (<ActionsFormLogicContainer 
								userService={this.props.userService}
								scaleID={this.props.scaleID}
								categoryID={this.props.categoryID!}
								onCategoryLoadError={()=>this.setState({ 
									badLoadErrorMessage: this.stdCategoryLoadErrorMessage 
								})}
							/>);
		
		
		let headingText = "";
		if(this.state.badLoadErrorMessage) 
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
					badLoadErrorMessage={this.state.badLoadErrorMessage}
					backButtonHandler={()=>{}}
					disableSubmit={undefined}
					actionsForm={actionsForm} />
			</div>
		);
	}
	
}