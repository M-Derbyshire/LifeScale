import ITimespan from './ITimespan';


/*
Represents a type of event that can be recorded. "weight" is the weight that
timespans for this action should get on the scale (Standard weight is 1. The weight is used
when calculating the balance of each category's timespan's values).
*/
interface IAction {
	id:string;
	name:string;
	weight:number;
	timespans:ITimespan[];
}

export default IAction;