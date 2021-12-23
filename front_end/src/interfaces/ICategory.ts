import IAction from './IAction';


interface ICategory {
	id:string;
	name:string;
	color:string;
	desiredWeight:number;
	actions:IAction[];
}

export default ICategory;