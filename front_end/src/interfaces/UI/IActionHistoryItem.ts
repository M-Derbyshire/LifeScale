import ITimespan from '../ITimespan';

// Used to represent a historical occurence of an action (as in, a timespan)
interface IActionHistoryItem {
	categoryName:string;
	actionName:string;
	timespan:ITimespan;
	deleteHandler:()=>void;
	deleteErrorMessage?:string;
}