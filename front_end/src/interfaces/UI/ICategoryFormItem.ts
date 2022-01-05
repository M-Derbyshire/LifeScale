import IActionFormItem from './IActionFormItem';

//Used to represent a category's required form info/callbacks
interface ICategoryFormItem {
	
	name:string;
	setName:(name:string)=>void;
	color:string;
	setColor:(color:string)=>void;
	desiredWeight:number;
	setDesiredWeight:(weight:number)=>void;
	
	newAction:IActionFormItem;
	actions:IActionFormItem[];
	
	onSubmit:()=>void;
	onDelete?:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}

export default ICategoryFormItem;