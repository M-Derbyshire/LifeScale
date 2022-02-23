import React, { Component } from 'react';
import ScaleDetailsForm from './ScaleDetailsForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IScale from '../../interfaces/IScale';


interface IScaleDetailsFormLogicContainerProps {
	scaleID?:string; //If undefined, this form will be used to create. Otherwise, form will update
	userService:IUserService;
	backButtonHandler:()=>void;
	editCategoryHandler:(categoryID:string)=>void;
	addCategoryHandler:()=>void;
	onSuccessfulDeleteHandler?:()=>void;
};

interface IScaleDetailsFormLogicContainerState {
	scale:IScale;
	originalScale:IScale; // used when updating/deleting (and to keep the original
							// header text during name change)
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
	badLoadErrorMessage?:string;
	disableSubmit:boolean;
};


export default class ScaleDetailsFormLogicContainer
	extends Component<IScaleDetailsFormLogicContainerProps, IScaleDetailsFormLogicContainerState>
{
	
	stdScaleLoadErrorMessage = "Unable to load the requested scale.";
	
	stdGoodSaveMessage = "Scale saved successfully.";

	
	constructor(props:IScaleDetailsFormLogicContainerProps)
	{
		super(props);
		
		let badLoadErrorMessage;
		
		const scaleObjects = this.loadOrCreateScale(this.props.scaleID);
		
		//empty string is falsy
		if(!scaleObjects.scale.id && this.props.scaleID)
				badLoadErrorMessage = this.stdScaleLoadErrorMessage;
		
		this.state = {
			scale: scaleObjects.scale,
			originalScale: scaleObjects.scaleOriginal,
			badLoadErrorMessage: badLoadErrorMessage,
			disableSubmit: false
		};
		
	}
	

	//If scale can't be loaded, create a default one
	// scaleOriginal is returned to use when updating/deleting
	loadOrCreateScale(scaleID?:string):{ scaleOriginal:IScale, scale:IScale }
	{
		//getScale may return undefined
		let scaleOriginal:IScale|undefined = (scaleID) 
							? this.props.userService.getScale(scaleID) 
							: undefined;
		
		if(!scaleOriginal)
		{
			scaleOriginal = { id:"", name: "", usesTimespans: false, displayDayCount: 1, categories: [] };
		}
		
		const scale = { ...scaleOriginal };
		
		
		return { scale, scaleOriginal };
	}
	
	
	
	createScaleHandler()
	{
		//Bad load message prop to be passed to form, if scale isn't there
		if(this.state.scale)
		{
			//The state scale can have an ID, so for future safety's sake, we're 
			//creating the new obect with the values
			const scale = this.state.scale;
			
			this.props.userService.createScale({
				name: scale.name,
				usesTimespans: scale.usesTimespans,
				displayDayCount: scale.displayDayCount,
				categories: scale.categories
			})
				.then(newScale => this.setState({ 
					scale: { ...newScale }, 
					originalScale: newScale,
					goodSaveMessage: this.stdGoodSaveMessage,
					badSaveErrorMessage: undefined,
					disableSubmit: false
				}))
				.catch(err => this.setState({ 
					badSaveErrorMessage: err.message,
					goodSaveMessage: undefined,
					disableSubmit: false
				}));
			
			
			this.setState({
				disableSubmit: true
			});
		}
		
	}
	
	updateScaleHandler()
	{
		this.props.userService.updateScale(this.state.originalScale, this.state.scale)
			.then(updatedScale => this.setState({ 
				originalScale: updatedScale,
				goodSaveMessage: this.stdGoodSaveMessage,
				badSaveErrorMessage: undefined,
				disableSubmit: false
			}))
			.catch(err => this.setState({ 
				badSaveErrorMessage: err.message,
				goodSaveMessage: undefined,
				disableSubmit: false
			}));
		
		
		this.setState({
			disableSubmit: true
		});
	}
	
	deleteScaleHandler()
	{
		this.props.userService.deleteScale(this.state.originalScale)
			.then(scales => {
				if(this.props.onSuccessfulDeleteHandler) 
					this.props.onSuccessfulDeleteHandler()
			})
			.catch(err => this.setState({ badSaveErrorMessage: err.message }));
	}
	
	
	
	
	
	render()
	{
		const isCreating = (!this.state.scale.id);
		
		let headingText = "";
		if(this.state.badLoadErrorMessage) 
			headingText = "Error";
		else if (!isCreating)
			headingText = `Edit Scale - ${this.state.originalScale.name}`;
		else
			headingText = "Create Scale";
		
		return (
			<div className="ScaleDetailsFormLogicContainer">
				<ScaleDetailsForm 
					headingText={headingText}
					badLoadErrorMessage={this.state.badLoadErrorMessage}
					backButtonHandler={this.props.backButtonHandler}
					disableSubmit={this.state.disableSubmit}
					hideCategories={isCreating}
					scaleItem={{
						
						name: this.state.scale.name,
						setName: (name:string) => this.setState({
							scale: { ...this.state.scale, name }
						}),
						
						usesTimespans: this.state.scale.usesTimespans,
						setUsesTimespans: (usesTimespans:boolean) => this.setState({
							scale: { ...this.state.scale, usesTimespans }
						}),
						
						dayCount: this.state.scale.displayDayCount,
						setDayCount: (displayDayCount:number) => this.setState({
							scale: { ...this.state.scale, displayDayCount }
						}),
												
						categories: this.state.originalScale.categories,
						
						onSubmit: (isCreating) ? this.createScaleHandler.bind(this) : this.updateScaleHandler.bind(this),
						onDelete: (isCreating) ? undefined : this.deleteScaleHandler.bind(this),
						badSaveErrorMessage: this.state.badSaveErrorMessage,
						goodSaveMessage: this.state.goodSaveMessage,
						
						addCategoryCallback: this.props.addCategoryHandler,
						editCategoryCallback: this.props.editCategoryHandler
					}} />
			</div>
		);
	}
	
}