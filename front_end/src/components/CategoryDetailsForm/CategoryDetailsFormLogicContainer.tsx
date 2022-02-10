import React, { Component } from 'react';
import CategoryDetailsForm from './CategoryDetailsForm';
import ActionsFormLogicContainer from '../ActionsForm/ActionsFormLogicContainer';
import IUserService from '../../interfaces/api_access/IUserService';


interface ICategoryDetailsFormLogicContainerProps {
	scaleID:string;
	categoryID?:string; //If undefined, this form will be used to create. Otherwise, form will update
	userService:IUserService;
	backButtonHandler:()=>void;
	onSuccessfulDeleteHandler?:()=>void;
};

interface ICategoryDetailsFormLogicContainerState {
	name:string;
	color:string;
	desiredWeight:number;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
};


export default class CategoryDetailsFormLogicContainer
	extends Component<ICategoryDetailsFormLogicContainerProps, ICategoryDetailsFormLogicContainerState>
{
	
	constructor(props:ICategoryDetailsFormLogicContainerProps)
	{
		super(props)
		
		this.state = {
			name: "",
			color: "",
			desiredWeight: 0
		};
	}
	
	
	
	render()
	{
		const isCreating = (!this.props.categoryID);
		
		const actionsForm = (!isCreating) ? (<ActionsFormLogicContainer 
															userService={this.props.userService}
															scaleID={this.props.scaleID}
															categoryID={this.props.categoryID}
															onCategoryLoadError={()=>{}}
														/>) : undefined;
		
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
					headingText=""
					badLoadErrorMessage={undefined}
					backButtonHandler={()=>{}}
					disableSubmit={undefined}
					actionsForm={actionsForm} />
			</div>
		);
	}
	
}