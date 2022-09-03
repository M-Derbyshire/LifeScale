import IAction from './IAction';

/*
Represents a "category" of events that can be recorded. "desiredWeight" is the
weight (on the displayed scale) that the user is aiming to have for this category (1 is
standard, but can be more or less to give the category more/less space on the desired
scale).
*/
interface ICategory {
	id:string;
	name:string;
	color:string;
	desiredWeight:number;
	actions:IAction[];
}

export default ICategory;