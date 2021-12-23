import ICategory from './ICategory';


interface IScale {
	id:string;
	name:string;
	usesTimespans:boolean;
	displayDayCount:number;
	categories:ICategory[];
}

export default IScale;