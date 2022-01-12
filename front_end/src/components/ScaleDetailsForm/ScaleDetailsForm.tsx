import React, { FC } from 'react';
import './ScaleDetailsForm.scss';
import IScaleFormItem from '../../interfaces/UI/IScaleFormItem';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import ScaleDetailsFormPartial from '../ScaleDetailsFormPartial/ScaleDetailsFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';

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
				
				<form onSubmit={props.scaleItem.onSubmit}>
					
					<ScaleDetailsFormPartial
						name={props.scaleItem.name}
						setName={props.scaleItem.setName}
						usesTimespans={props.scaleItem.usesTimespans}
						setUsesTimespans={props.scaleItem.setUsesTimespans}
						dayCount={props.scaleItem.dayCount}
						setDayCount={props.scaleItem.setDayCount} />
					
					
					{props.scaleItem.badSaveErrorMessage && 
							<BadSaveMessage message={props.scaleItem.badSaveErrorMessage} />}
					{props.scaleItem.goodSaveMessage && 
							<GoodSaveMessage message={props.scaleItem.goodSaveMessage} />}
					
					{/* Any buttons other than submit need to have type="button", to avoid submit behaviour */}
					<input type="submit" value="Save" disabled={props.disableSubmit} />
					{props.scaleItem.onDelete && 
						<button type="button" onClick={props.scaleItem.onDelete}>Delete</button>}
					
				</form>
				
			} />
			
			
		</div>
	);
	
};

export default ScaleDetailsForm;