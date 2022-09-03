import SaveMessage from './SaveMessage';

/*
	Used to display a message when something has been sucessfully saved.
	See the SaveMessage component for more details and the props
*/
export default class GoodSaveMessage extends SaveMessage {
	
	foreColor:string = "#00cc00";
	backColor:string = "#cdffcd";
	className = "GoodSaveMessage";
	
};