import ITimespan from './ITimespan';


interface IAction {
	id:string;
	name:string;
	weight:number;
	timespans:ITimespan[];
}

export default IAction;