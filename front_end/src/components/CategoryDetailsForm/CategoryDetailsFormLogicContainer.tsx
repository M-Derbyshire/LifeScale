import React, { Component } from 'react';
import CategoryDetailsForm from './CategoryDetailsForm';
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
		
		
		return (
			<div className="CategoryDetailsFormLogicContainer">
				
			</div>
		);
	}
	
}