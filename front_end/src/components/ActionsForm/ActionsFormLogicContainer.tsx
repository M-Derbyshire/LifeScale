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

interface IActionsFormLogicContainerProps {
	userService:IUserService;
	scaleID:string;
	categoryID:string;
	onCategoryLoadError?:(errorMessage:string)=>void;
}

interface IActionsFormLogicContainerState {
	category?:ICategory;
	actions?:IAction[]; //Actions that we can edit as state
	originalActions?:IAction[]; //References to actions in userService (used when updating/deleting)
	lastActionSaveMessage:IActionSaveMessage; //We only need to display the last save message (good or bad)
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
		
		const category = this.loadCategory();
		const actionLists = this.loadActionLists(category);
		
		this.state = {
			category,
			actions: actionLists.actions,
			originalActions: actionLists.originalActions,
			lastActionSaveMessage
		};
	}
	
	
	
	loadCategory():ICategory|undefined
	{
		const category = this.props.userService.getCategory(this.props.categoryID, this.props.scaleID);
		
		if (!category && this.props.onCategoryLoadError) 
			this.props.onCategoryLoadError(this.stdCategoryLoadError);
		
		return category; //If an issue on load, this will be undefined
	}
	
	//actions are the actions that can be changed here (as state)
	//originalActions are references to the action from the userService (used in updating/deleting)
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
				return category.actions.map(action => ({ ...action }));
			}
		} 
		catch {}
		
		return undefined;
	}
	
	
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
	
	
	
	updateHandler(action:IAction, index:number)
	{
		if(this.state.originalActions)
			this.props.userService.updateAction(this.state.originalActions[index], action)
				.then(action => {})
				.catch(err => this.setState({ 
					lastActionSaveMessage: {
						actionID: action.id,
						isError: true,
						saveMessage: `Unable to save action: ${err.message}`
					}
				 }));
	}
	
	deleteHandler(action:IAction, actionIndex:number)
	{
		if(this.state.category && this.state.originalActions)
			this.props.userService.deleteAction(this.state.category, this.state.originalActions[actionIndex])
				.then(actions => {
					const category = this.loadCategory();
					const actionLists = this.loadActionLists(category);
					this.setState({
						category,
						actions: actionLists.actions,
						originalActions: actionLists.originalActions,
					});
				})
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
			goodSaveMessage: undefined
		};
	}
	
	
	
	render()
	{
		const actions = this.state.actions!.map((act, i) => this.mapActionToFormItem(act, i, false));
		
		return (
			<div className="ActionsFormLogicContainer">
				<ActionsForm 
					actions={actions}
					newAction={{
						id: "",
						name: "test",
						setName:(name:string)=>{},
						weight: 1,
						setWeight: (weight:number)=>{},
						onSubmit: ()=>{},
						onDelete: undefined,
						badSaveErrorMessage: undefined,
						goodSaveMessage: undefined
					}} />
			</div>
		);
	}
	
};