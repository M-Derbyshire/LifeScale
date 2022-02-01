import React, { Component } from 'react';
import RecordActionForm from './RecordActionForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';
import ITimespan from '../../interfaces/ITimespan';


interface IRecordActionFormLogicContainerProps {
	userService:IUserService;
	scale:IScale;
}

interface IRecordActionFormLogicContainerState {
	selectedCategoryID:string;
	selectedActionID:string;
	
	usesTimespans?:boolean;
	timespan:ITimespan;
	
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}


export default class RecordActionFormLogicContainer
	extends Component<IRecordActionFormLogicContainerProps, IRecordActionFormLogicContainerState>
{
	
	constructor(props:IRecordActionFormLogicContainerProps)
	{
		super(props);
		
		
	}
	
	
	render()
	{
		
		return (
			<div className="RecordActionFormLogicContainer">
				
			</div>
		);
	}
	
}