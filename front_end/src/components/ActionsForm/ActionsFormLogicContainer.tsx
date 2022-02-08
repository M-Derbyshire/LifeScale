import React, { Component } from 'react';
import ActionsForm from './ActionsForm';
import IUserService from '../../interfaces/api_access/IUserService';
import IAction from '../../interfaces/IAction';
import ICategory from '../../interfaces/ICategory';
import IActionFormItem from '../../interfaces/UI/IActionFormItem';



// Used to record error/success during the deletion/saving of actions
interface IActionSaveMessage {
	actionID:string;
	isError:boolean;
	saveMessage:string;
}

interface INewActionData {
	name:string;
	weight:number;
	badSaveErrorMessage?:string;
}

interface IActionsFormLogicContainerProps {
	userService:IUserService;
	scaleID:string;
	categoryID:string;
	onCategoryLoadError?:(errorMessage:string)=>void;
}

interface IActionsFormLogicContainerState {
	category?:ICategory;
	newAction:INewActionData;
	actions?:IAction[]; //Actions that we can edit as state
	originalActions?:IAction[]; //References to actions in userService (used when updating/deleting)
	lastActionSaveMessage:IActionSaveMessage; //We only need to display the last save message (good or bad)
	displayNewActionForm:boolean;
}


export default class ActionsFormLogicContainer
	extends Component<IActionsFormLogicContainerProps, IActionsFormLogicContainerState>
{
	
	stdCategoryLoadError = "Unable to load the requested category.";
	stdActionsLoadError = "Unable to load the actions for the requested category";
	
	
	constructor(props:IActionsFormLogicContainerProps)
	{
		super(props)
		
		const lastActionSaveMessage = {
			actionID: "",
			isError: false,
			saveMessage: ""
		};
		
		const newAction:INewActionData = {
			name: "",
			weight: 0,
			badSaveErrorMessage: undefined,
		};
		
		const category = this.loadCategory();
		const actionLists = this.loadActionLists(category);
		
		this.state = {
			category,
			newAction,
			actions: actionLists.actions,
			originalActions: actionLists.originalActions,
			lastActionSaveMessage,
			displayNewActionForm: false
		};
	}
	
	
	
	loadCategory():ICategory|undefined
	{
		const category = this.props.userService.getCategory(this.props.categoryID, this.props.scaleID);
		
		if (!category && this.props.onCategoryLoadError) 
			this.props.onCategoryLoadError(this.stdCategoryLoadError);
		
		return category; //If an issue on load, this will be undefined
	}
	
	//Return values:
	//actions - are the actions that can be changed (as state)
	//originalActions - are references to the action's references from the userService (used in updating/deleting)
	loadActionLists(category:ICategory|undefined):{ actions:IAction[]|undefined, originalActions:IAction[]|undefined }
	{
		let actions:IAction[]|undefined = undefined;
		let originalActions:IAction[]|undefined = undefined;
		
		if (!category) 
			actions = [];
		else
		{
			originalActions = category.actions;
			actions = this.getRefreshedActionList(category);
		}
		
		if (category && (!actions || !originalActions) && this.props.onCategoryLoadError)
			this.props.onCategoryLoadError(this.stdActionsLoadError);
		
		
		return {
			actions,
			originalActions
		};
	}
	
	getRefreshedActionList(category:ICategory)
	{
		try 
		{
			if(category)
			{
				//We don't want references to the originals (timespans being references is not an issue)
				return category.actions.map(action => ({ ...action }));
			}
		} 
		catch {}
		
		return undefined;
	}
	
	
	//Update single action in the actions state array
	updateSingleActionState(newActionData:IAction, newActionIndex:number)
	{
		this.setState(state => {
			return { 
				actions: state.actions!.map((action, i) => {
					if(i === newActionIndex)
						return newActionData;
					else
						return action;
				})
			};
		});
	}
	
	refreshCategoryActionListStates()
	{
		const category = this.loadCategory();
		const actionLists = this.loadActionLists(category);
		this.setState({
			category,
			actions: actionLists.actions,
			originalActions: actionLists.originalActions,
		});
	}
	
	
	
	//onSubmit for new actions
	createHandler()
	{
		const newAction = {
			name: this.state.newAction.name,
			weight: this.state.newAction.weight,
			timespans: []
		};
		
		//If no category, the onCategoryLoadError is called
		if(this.state.category)
			this.props.userService.createAction(this.state.category, newAction)
				.then(savedAction => {
					this.setState({ displayNewActionForm: false });
					this.refreshCategoryActionListStates();
				})
				.catch(err => this.setState({ 
					newAction: {
						...newAction, 
						badSaveErrorMessage: `Unable to create new action: ${err.message}` 
					}
				}));
	}
	
	//onSubmit for existing actions
	updateHandler(action:IAction, index:number)
	{
		//If no actions, the onCategoryLoadError is called
		if(this.state.originalActions)
			this.props.userService.updateAction(this.state.originalActions[index], action)
				.then(action => this.setState({ 
					lastActionSaveMessage: {
						actionID: action.id,
						isError: false,
						saveMessage: "Action Saved Successfully."
					}
				 }))
				.catch(err => this.setState({ 
					lastActionSaveMessage: {
						actionID: action.id,
						isError: true,
						saveMessage: `Unable to save action: ${err.message}`
					}
				 }));
	}
	
	//onDelete for actions
	deleteHandler(action:IAction, actionIndex:number)
	{
		//If no category or actions, the onCategoryLoadError is called
		if(this.state.category && this.state.originalActions)
			this.props.userService.deleteAction(this.state.category, this.state.originalActions[actionIndex])
				.then(actions => this.refreshCategoryActionListStates())
				.catch(err => this.setState({ 
					lastActionSaveMessage: {
						actionID: action.id,
						isError: true,
						saveMessage: `Unable to delete action: ${err.message}`
					}
				 }))
	}
	
	
	
	
	mapActionToFormItem(action:IAction, index:number, isNewAction = false):IActionFormItem
	{
		const lastActionSaveMessage = this.state.lastActionSaveMessage;
		const hasSaveMessage = (lastActionSaveMessage.actionID === action.id);
		const goodSaveMessage = 
			(hasSaveMessage && !lastActionSaveMessage.isError) ? lastActionSaveMessage.saveMessage : undefined;
		const badSaveMessage = 
			(hasSaveMessage && lastActionSaveMessage.isError) ? lastActionSaveMessage.saveMessage : undefined;
		
		
		return {
			id: action.id,
			name: action.name,
			setName: (name:string) => this.updateSingleActionState({ ...action, name }, index),
			weight: action.weight,
			setWeight: (weight:number) => this.updateSingleActionState({ ...action, weight }, index),
			onSubmit: () => this.updateHandler(action, index),
			onDelete: (!isNewAction) ? () => this.deleteHandler(action, index) : undefined,
			badSaveErrorMessage: badSaveMessage,
			goodSaveMessage
		};
	}
	
	
	
	render()
	{
		const actions = this.state.actions!.map((act, i) => this.mapActionToFormItem(act, i, false));
		const newAction = this.state.newAction;
		
		return (
			<div className="ActionsFormLogicContainer">
				<ActionsForm 
					displayNewActionForm={this.state.displayNewActionForm}
					setDisplayNewActionForm={(newVal:boolean) => this.setState({
						displayNewActionForm: newVal
					})}
					actions={actions}
					newAction={{
						id: "",
						name: newAction.name,
						setName: (name:string) => this.setState({ newAction: { ...newAction, name } }),
						weight: newAction.weight,
						setWeight: (weight:number) => this.setState({ newAction: { ...newAction, weight } }),
						onSubmit: this.createHandler.bind(this),
						onDelete: undefined,
						badSaveErrorMessage: newAction.badSaveErrorMessage,
						goodSaveMessage: undefined
					}} />
			</div>
		);
	}
	
};