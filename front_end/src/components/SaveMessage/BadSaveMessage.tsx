import SaveMessage from './SaveMessage';

/*
	Used to display a message when something has been unsucessful in saving.
	See the SaveMessage component for more details and the props
*/
export default class BadSaveMessage extends SaveMessage {
	
	foreColor:string = "#ff0000";
	backColor:string = "#ffcdcd";
	className = "BadSaveMessage";
	testName = "badSaveMessage";
	
};