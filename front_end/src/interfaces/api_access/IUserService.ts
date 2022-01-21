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
	loginUser:(email:string, password:string)=>Promise<void>;
	isLoggedIn:()=>boolean;
	
	getLoadedUser:()=>IUser; //Will throw if no user loaded (logging in loads the user)
	createUser:(newUser: IUser & { password:string })=>Promise<void>;
	updateLoadedUser:(newUserData:IUser)=>Promise<void>;
	updateLoadedUserPassword:(currentPassword:string, newPassword:string)=>Promise<void>;
	
	createScale:(newScale:IScale)=>Promise<void>;
	updateScale:(currentScale:IScale, newScaleData:IScale)=>Promise<void>;
	deleteScale:(scale:IScale)=>Promise<void>;
	
	createCategory:(newCategory:ICategory)=>Promise<void>;
	updateCategory:(currentCategory:ICategory, newCategoryData:ICategory)=>Promise<void>;
	deleteCategory:(category:ICategory)=>Promise<void>;
	
	createAction:(newAction:IAction)=>Promise<void>;
	updateAction:(currentAction:IAction, newActionData:IAction)=>Promise<void>;
	deleteAction:(action:IAction)=>Promise<void>;
	
	//At this time, you can replace timespans by deleting/creating, but not update
	createTimespan:(newTimespan:ITimespan)=>Promise<void>;
	deleteTimespan:(timespan:ITimespan)=>Promise<void>;
	
}

export default IUserService;