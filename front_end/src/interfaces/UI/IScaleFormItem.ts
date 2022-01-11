import ICategory from '../ICategory';

//Used to represent a scale's required form info/callbacks
interface IScaleFormItem {
	name:string;
	setName:(name:string)=>void;
	usesTimespans:boolean;
	setUsesTimespans:(usesTimespans:boolean)=>void;
	dayCount:number;
	setDayCount:(dayCount:number)=>void;
	
	categories:ICategory[];
	
	onSubmit:()=>void;
	onDelete?:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}

export default IScaleFormItem;