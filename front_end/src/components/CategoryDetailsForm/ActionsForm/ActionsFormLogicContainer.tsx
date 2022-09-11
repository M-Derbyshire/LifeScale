import React, { Component } from 'react';
import ActionsForm from './ActionsForm';
import IUserService from '../../../interfaces/api_access/IUserService';
import IAction from '../../../interfaces/IAction';
import ICategory from '../../../interfaces/ICategory';
import IScale from '../../../interfaces/IScale';
import IActionFormItem from '../../../interfaces/UI/IActionFormItem';



// Used to record error/success during the deletion/saving of actions
interface IActionSaveMessage {
	actionID:string;
	isError:boolean;
	saveMessage:string;
}

// Used as the state for a new action, before it is saved (the data for the form that you are creating the action with)
interface INewActionData {
	name:string;
	weight:number;
	badSaveErrorMessage?:string;
}



interface IActionsFormLogicContainerProps {
	userService:IUserService;
	scale:IScale;
	category:ICategory;
}

interface IActionsFormLogicContainerState {
	newAction:INewActionData; //When creating a new action, this is the state
	actions:IAction[]; //The current action's data
	originalActions:IAction[]; //Original action data from the userService (needed when updating/deleting). We shouldn't change these
	lastActionSaveMessage:IActionSaveMessage; //Message from last save attempt. (We only need to display the last one)
	displayNewActionForm:boolean; // Should the form used to create a new action be displayed?
}


/*
	Wrapper component that controls the business logic for the ActionsForm component.
	See the ActionsForm component for more description.
*/
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
		
		//get the original action list from the userService, along with a clone of that list (the latter is what we should edit)
		const actionLists = this.loadActionLists(this.props.category);
		
		this.state = {
			newAction,
			actions: actionLists.actions,
			originalActions: actionLists.originalActions,
			lastActionSaveMessage,
			displayNewActionForm: false
		};
	}
	
	
	
	
	componentWillUnmount()
	{
		this.props.userService.abortRequests();
	}
	
	
	
	
	
	//Return values:
	//actions - are the actions that can be changed (as state)
	//originalActions - are the actions that shouldn't be changed once set in state, unless after save (used in updating/deleting)
	loadActionLists(category:ICategory):{ actions:IAction[], originalActions:IAction[] }
	{
		return {
			actions: this.getRefreshedActionList(category),
			originalActions: category.actions
		};
	}
	
	
	// Get cloned actions, from a category
	getRefreshedActionList(category:ICategory)
	{
		return category.actions.map(action => ({ ...action }));
	}
	
	
	
	
	//Update single action in the actions state array
	updateSingleActionState(newActionData:IAction, newActionIndex:number)
	{
		this.setState(state => {
			return { 
				actions: state.actions.map((action, i) => {
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
		//get the original action list from the userService, along with a clone of that list (the latter is what we should edit)
		// and set them in the state again
		const actionLists = this.loadActionLists(this.props.category);
		this.setState({
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
		
		this.props.userService.createAction(this.props.scale, this.props.category, newAction)
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
		this.props.userService.updateAction(
			this.props.scale,
			this.props.category, 
			this.state.originalActions[index],
			action
		)
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
		this.props.userService.deleteAction(
				this.props.scale, 
				this.props.category, 
				this.state.originalActions[actionIndex]
			)
			.then(actions => this.refreshCategoryActionListStates())
			.catch(err => this.setState({ 
				lastActionSaveMessage: {
					actionID: action.id,
					isError: true,
					saveMessage: `Unable to delete action: ${err.message}`
				}
			}))
	}
	
	
	
	
	
	
	// ActionsForm component takes an IActionFormItem[] as the actions prop. This converts an IAction to IActionFormItem
	// index is the action's index in the state.actions array
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
		const actions = this.state.actions.map((act, i) => this.mapActionToFormItem(act, i, false));
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