
//Used to represent a single action's required form info/callbacks
interface IActionFormItem {
	name:string;
	setName:(name:string)=>void;
	weight:number;
	setWeight:(weight:number)=>void;
	onSubmit:()=>void;
	onDelete?:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}


export default IActionFormItem;