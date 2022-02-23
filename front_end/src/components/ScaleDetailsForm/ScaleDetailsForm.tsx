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

	hideCategories?:boolean;
}

type mapCategoryToCardType = ((id:string, name:string)=>ReactElement);


/*

	This is used to create and edit scales in the system (it also displays a CardDisplay, to provide 
	links to create/edit categories). The container component should handle the logic
*/
class ScaleDetailsForm extends Component<IScaleDetailsFormProps>
{
	emptyCardDisplayMessage:string;
	
	constructor(props:IScaleDetailsFormProps)
	{
		super(props);
		
		//In theory, this should never be displayed as we'll always pass an AddItemCard, however this is required
		//by the CardDisplay, and is good for future-proofing.
		this.emptyCardDisplayMessage = "There are no categories for this scale.";
	}
	
	mapCategoryToCard:mapCategoryToCardType = (id:string, name:string) => {
		return (
			<EditableItemCard key={id} name={name} editCallback={
				() => this.props.scaleItem!.editCategoryCallback(id)
			} />
		);
	}
	
	
	render()
	{
		//Set this if scaleItem is defined (used to display categories in CardDisplay)
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
					<button className="scaleBackButton" onClick={this.props.backButtonHandler}>Back</button>
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
						
						{/* Any buttons other than submit need to have type="button", to avoid submit behaviour */}
						<input type="submit" value="Save" disabled={this.props.disableSubmit} />
						{this.props.scaleItem.onDelete && 
							<button type="button" onClick={this.props.scaleItem.onDelete}>Delete</button>}
						
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