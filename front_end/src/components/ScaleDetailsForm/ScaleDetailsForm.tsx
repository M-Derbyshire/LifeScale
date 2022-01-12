import React, { FC } from 'react';
import './ScaleDetailsForm.scss';
import IScaleFormItem from '../../interfaces/UI/IScaleFormItem';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import ScaleDetailsFormPartial from '../ScaleDetailsFormPartial/ScaleDetailsFormPartial';

interface IScaleDetailsFormProps {
	scaleItem?:IScaleFormItem;
	
	headingText:string;
	badLoadErrorMessage?:string;
	
	backButtonHandler:()=>void;
	disableSubmit?:boolean;
}



const ScaleDetailsForm:FC<IScaleDetailsFormProps> = (props) => {
	
	
	return (
		<div className="ScaleDetailsForm">
			
			<header>
				<h1>{props.headingText}</h1>
				<button className="scaleBackButton" onClick={props.backButtonHandler}>Back</button>
			</header>
			
			<LoadedContentWrapper errorMessage={props.badLoadErrorMessage} render={props.scaleItem && 
				
				<form>
					
					<ScaleDetailsFormPartial
						name={props.scaleItem.name}
						setName={props.scaleItem.setName}
						usesTimespans={props.scaleItem.usesTimespans}
						setUsesTimespans={props.scaleItem.setUsesTimespans}
						dayCount={props.scaleItem.dayCount}
						setDayCount={props.scaleItem.setDayCount} />
					
				</form>
				
			} />
			
			
		</div>
	);
	
};

export default ScaleDetailsForm;