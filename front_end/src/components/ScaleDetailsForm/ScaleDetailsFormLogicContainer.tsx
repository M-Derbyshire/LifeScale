import React, { Component } from 'react';
import ScaleDetailsForm from './ScaleDetailsForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';


interface IScaleDetailsFormLogicContainerProps {
	scaleID?:string; //If undefined, this form will be used to create. Otherwise, form will update
	userService:IUserService;
	backButtonHandler:()=>void;
	onSuccessfulDeleteHandler?:()=>void;
};

interface IScaleDetailsFormLogicContainerState {
	scale:IScale;
	originalScaleRef:IScale; // used when updating/deleting (and to keep the original
							// header text during name change)
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
	badLoadErrorMessage?:string;
	disableSubmit:boolean;
};


export default class ScaleDetailsFormLogicContainer
	extends Component<IScaleDetailsFormLogicContainerProps, IScaleDetailsFormLogicContainerState>
{
	
	constructor(props:IScaleDetailsFormLogicContainerProps)
	{
		super(props);
		
		
	}
	
	
	
	render()
	{
		
		
		return (
			<div className="ScaleDetailsFormLogicContainer">
				
			</div>
		);
	}
	
}