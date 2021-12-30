import ITimespan from '../ITimespan';

// Used to represent a historical occurence of an action (as in, a timespan)
interface IActionHistoryItem {
	categoryName:string;
	actionName:string;
	timespan:ITimespan;
	deleteHandler:()=>void; //Will delete the item from it's containing array
	deleteErrorMessage?:string; //The error message, if there was a problem deleting the item
}

export default IActionHistoryItem;