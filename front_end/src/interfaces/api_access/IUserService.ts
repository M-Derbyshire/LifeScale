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
	- If a Promise resolves, it will return the related entity (e.g. An IScale when creating a scale).
		However, if the method was deleting from an array, the array will be returned.
	- If a Promise rejects, it will return an Error object (unless stated otherwise below)
	- When making a change to an entity, the change should only be persisted to the current user object 
		if the API call was successful. Otherwise, the change should be reverted (or never made at all)
*/
interface IUserService {
	
	//Will load the user, and all its related entities, if logged in succesfully.
	//When rejecting promise, this will return an ILoginFailureInformation object 
	//(to seperate http errors from bad login).
	loginUser:(email:string, password:string)=>Promise<any>;
	
	logoutUser:()=>Promise<any>; //If the promise resolves, null is returned
	
	isLoggedIn:()=>boolean;
	
	requestNewPassword:(email:string)=>Promise<any>; //If the promise resolves, null is returned
	
	getLoadedUser:()=>IUser; //Will throw if no user loaded (logging in loads the user)
	createUser:(newUser: Omit<IUser, "id"> & { password:string })=>Promise<any>;
	updateLoadedUser:(newUserData:IUser)=>Promise<any>;
	updateLoadedUserPassword:(currentPassword:string, newPassword:string)=>Promise<any>; //Reject
													//returns IPasswordFailureInformation object
	
	
	createScale:(newScale:Omit<IScale, "id">)=>Promise<any>;
	updateScale:(currentScale:IScale, newScaleData:IScale)=>Promise<any>;
	deleteScale:(scale:IScale)=>Promise<any>;
	
	createCategory:(parentScale:IScale, newCategory:Omit<ICategory, "id">)=>Promise<any>;
	updateCategory:(currentCategory:ICategory, newCategoryData:ICategory)=>Promise<any>;
	deleteCategory:(parentScale:IScale, category:ICategory)=>Promise<any>;
	
	createAction:(parentCategory:ICategory, newAction:Omit<IAction, "id">)=>Promise<any>;
	updateAction:(currentAction:IAction, newActionData:IAction)=>Promise<any>;
	deleteAction:(parentCategory:ICategory, action:IAction)=>Promise<any>;
	
	//At this time, you can replace timespans by deleting/creating, but not update
	createTimespan:(parentAction:IAction, newTimespan:Omit<ITimespan, "id">)=>Promise<any>;
	deleteTimespan:(parentAction:IAction, timespan:ITimespan)=>Promise<any>;
	
}



interface ILoginFailureInformation { 
	isBadLogin:boolean;
	error: Error;
}

interface IPasswordFailureInformation { 
	isBadPassword:boolean;
	error: Error;
}


export default IUserService;
export type { ILoginFailureInformation, IPasswordFailureInformation };