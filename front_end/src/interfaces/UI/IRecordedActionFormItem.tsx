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
	
	//The minute/hour inputs of the RecordActionForm may need to temporarily by an invalid number (such 
	//as an empty string). Therefore, these should be updated with every state change, whereas the timespan's
	//minute value should only be updated when the input is a valid number.
	minuteDisplayValue:string;
	setMinuteDisplayValue:(value:string)=>void;
	hourDisplayValue:string;
	setHourDisplayValue:(value:string)=>void;
	
	onSubmit:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}

export default IRecordedActionFormItem;