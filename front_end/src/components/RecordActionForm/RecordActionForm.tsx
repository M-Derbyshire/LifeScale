import React, { FC } from 'react';
import './RecordActionForm.scss';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import ITimespan from '../../interfaces/ITimespan';

interface IRecordActionFormProps {
	categories:ICategory[];
	selectedCategory:ICategory;
	setSelectedCategory:(category:ICategory)=>void;
	
	actions:IAction[]
	selectedAction:IAction;
	setSelectedAction:(action:IAction)=>void;
	
	timespan:ITimespan;
	setTimespan:(timespan:ITimespan)=>void;
	
	onSubmit:()=>void;
}


/*
	Used to record an occurrence of an action
*/
const RecordActionForm:FC<IRecordActionFormProps> = (props) => {
	
	return (
		<div className="RecordActionForm">
			
		</div>
	);
	
};

export default RecordActionForm;