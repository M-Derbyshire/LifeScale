import ITimespan from '../ITimespan';
import ICategory from '../ICategory';

// Used to represent a recorded action's form data/setStates/callbacks
interface IRecordedActionFormItem {
	categories:ICategory[];
	selectedCategoryID:string;
	setSelectedCategoryID:(category:string)=>void;
	
	selectedActionID:string;
	setSelectedActionID:(action:string)=>void;
	
	usesTimespans?:boolean
	timespan:ITimespan;
	setTimespan:(timespan:ITimespan)=>void;
	
	onSubmit:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}

export default IRecordedActionFormItem;