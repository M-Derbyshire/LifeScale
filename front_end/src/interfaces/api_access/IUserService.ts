import IUser from '../IUser';
import IScale from '../IScale';
import ICategory from '../ICategory';
import IAction from '../IAction';
import ITimespan from '../ITimespan';

/*
	A "service" class that implements this interface will be used to login, load, access, and
	set a user's information (including the related entities, as this is based on a document
	database model).
	
	This is mainly designed to work with APIs that are based on a document model database 
	paradigm. However, this could be implemented to work with an API that has seperate endpoints 
	for the different entities (however, when loading the user, it should also fetch all related 
	entities, to build an IUser object with all the necessary data).
	
	See further rules below (unfortunately, there is no way in Typescript to define what a promise's 
	resolve/reject parameters should be):
	- If a Promise resolves, it will return the related entity (e.g. An IScale when creating a scale)
	- If a Promise rejects, it will return a string with the error (unless stated otherwise below)
*/
interface IUserService {
	
	//Will load the user, and all it's related entities, if logged in succesfully
	//When rejecting promise, this will return an object (to seperate http 
	//errors from bad login). See below: 
	//	{ isBadLogin: boolean, message: string }
	loginUser:(email:string, password:string)=>Promise;
	isLoggedIn:()=>boolean;
	
	getLoadedUser:()=>IUser; //Will throw if no user loaded (logging in loads the user)
	createUser:(newUser: IUser & { password:string })=>Promise;
	updateLoadedUser:(newUserData:IUser)=>Promise;
	updateLoadedUserPassword(currentPassword:string, newPassword:string)=>Promise;
	
	createScale(newScale:ISCale)=>Promise;
	updateScale(currentScale:IScale, newScaleData:IScale)=>Promise;
	deleteScale(scale:IScale)=>Promise;
	
	createCategory(newCategory:ICategory)=>Promise;
	updateCategory(currentCategory:ICategory, newCategoryData:ICategory)=>Promise;
	deleteCategory(category:ICategory)=>Promise;
	
	createAction(newAction:IAction)=>Promise;
	updateAction(currentAction:IAction, newActionData:IAction)=>Promise;
	deleteAction(action:IAction)=>Promise;
	
	//At this time, you can replace timespans by deleting/creating, but not update
	createTimespan(newTimespan:ITimespan)=>Promise;
	deleteTimespan(timespan:ITimespan)=>Promise;
	
}

export default IUserService;