import React, { Component, ReactElement } from 'react';
import './ScaleDetailsForm.scss';
import IScaleFormItem from '../../interfaces/UI/IScaleFormItem';
import LoadedContentWrapper from '../LoadedContentWrapper/LoadedContentWrapper';
import ScaleDetailsFormPartial from '../ScaleDetailsFormPartial/ScaleDetailsFormPartial';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';
import GoodSaveMessage from '../SaveMessage/GoodSaveMessage';
import CardDisplay from '../CardDisplay/CardDisplay';
import AddItemCard from '../AddItemCard/AddItemCard';
import EditableItemCard from '../EditableItemCard/EditableItemCard';

interface IScaleDetailsFormProps {
	scaleItem?:IScaleFormItem;
	
	headingText:string;
	badLoadErrorMessage?:string;
	
	backButtonHandler:()=>void;
	disableSubmit?:boolean;

	hideCategories?:boolean; //When creating, we won't want to display the category section (as you need to create the scale first)
}

type mapCategoryToCardType = ((id:string, name:string)=>ReactElement);


/*

	This is used to create and edit scales in the system (it can also display a CardDisplay component, to provide 
	links to create/edit categories). The logic container component should handle the logic.
*/
class ScaleDetailsForm extends Component<IScaleDetailsFormProps>
{
	emptyCardDisplayMessage:string;
	
	constructor(props:IScaleDetailsFormProps)
	{
		super(props);
		
		//If there are no "card" components to dislay in the category section. In theory, this should never be displayed 
		//as we'll always pass an AddItemCard, however this is required by the CardDisplay, and is good for future-proofing.
		this.emptyCardDisplayMessage = "There are no categories for this scale.";
	}
	
	// Map category info to a "card" component
	mapCategoryToCard:mapCategoryToCardType = (id:string, name:string) => {
		return (
			<EditableItemCard key={id} name={name} editCallback={() => this.props.scaleItem!.editCategoryCallback(id)} />
		);
	}
	
	
	render()
	{
		//Set this if scaleItem is defined (used to display categories in CardDisplay component)
		let cardDisplayItems:ReactElement[] = [];
		
		if(this.props.scaleItem && this.props.scaleItem.categories) //Have to check both, to stop jest complaining
		{
			const editCardElements = this.props.scaleItem.categories.map(
				(cat) => this.mapCategoryToCard(cat.id, cat.name)
			);
			
			
			const addCardElement = (<AddItemCard key="addCategoryFormItemCard" onClick={this.props.scaleItem.addCategoryCallback} />);
			
			cardDisplayItems = [...editCardElements, addCardElement];
		}
		
		
		
		return (
			<div className="ScaleDetailsForm">
				
				<header>
					<h1>{this.props.headingText}</h1>
					<button className="scaleBackButton" data-test="scaleDetailsBackBtn" onClick={this.props.backButtonHandler}>Back</button>
				</header>
				
				<LoadedContentWrapper errorMessage={this.props.badLoadErrorMessage} render={this.props.scaleItem && <div>
					
					<form onSubmit={ (e) => { e.preventDefault(); this.props.scaleItem!.onSubmit(); } }>
						
						<ScaleDetailsFormPartial
							name={this.props.scaleItem.name}
							setName={this.props.scaleItem.setName}
							usesTimespans={this.props.scaleItem.usesTimespans}
							setUsesTimespans={this.props.scaleItem.setUsesTimespans}
							dayCount={this.props.scaleItem.dayCount}
							setDayCount={this.props.scaleItem.setDayCount} />
						
						
						{this.props.scaleItem.badSaveErrorMessage && 
								<BadSaveMessage message={this.props.scaleItem.badSaveErrorMessage} />}
						{this.props.scaleItem.goodSaveMessage && 
								<GoodSaveMessage message={this.props.scaleItem.goodSaveMessage} />}
						
						
						<input type="submit" data-test="scaleDetailsSaveBtn" value="Save" disabled={this.props.disableSubmit} />
						{this.props.scaleItem.onDelete && 
							<button type="button" data-test="scaleDeleteBtn" onClick={this.props.scaleItem.onDelete}>Delete</button>}
						
					</form>
					
					
					{!this.props.hideCategories && <div className="categorySection">
						<h2>Categories</h2>
						<CardDisplay emptyDisplayMessage={this.emptyCardDisplayMessage}>
							{cardDisplayItems}
						</CardDisplay>
					</div>}
					
					
				</div>} />
				
				
			</div>
		);
	}
	
	
}

export default ScaleDetailsForm;