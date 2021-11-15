import SaveMessage from './SaveMessage';

/*
	Used to display a message when something has been unsucessful in saving
*/
export default class BadSaveMessage extends SaveMessage {
	
	foreColor:string = "#ff0000";
	backColor:string = "#ffcdcd";
	className:string = "BadSaveMessage";
	
};