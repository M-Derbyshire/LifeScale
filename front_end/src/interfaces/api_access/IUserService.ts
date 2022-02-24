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
	paradigm (which is partly why the categories/actions/timespans methods also get passed  
	the entities -- e.g. scales for categories -- that contain those entities). However, this 
	could be implemented to work with an API that has seperate endpoints for the different 
	entities (however, when loading the user, it should also fetch all related entities, to 
	build an IUser object with all the necessary data).
	
	See further rules below:
	- If a Promise resolves, it will return the related entity (e.g. An IScale when creating a scale).
		However, if the method was deleting from an array, the array will be returned.
	- When making a change to an entity, the change should only be persisted to the current user object 
		if the API call was successful. Otherwise, the change should be reverted (or never made at all)
*/
interface IUserService {
	
	//Will load the user, and all its related entities, if logged in succesfully.
	loginUser:(email:string, password:string)=>Promise<IUser>;
	
	logoutUser:()=>Promise<null>; //If the promise resolves, null is returned
	
	isLoggedIn:()=>boolean;
	
	requestNewPassword:(email:string)=>Promise<null>; //If the promise resolves, null is returned
	
	getLoadedUser:()=>IUser; //Will throw if no user loaded (logging in loads the user)
	createUser:(newUser: Omit<IUser, "id"> & { password:string })=>Promise<IUser>;
	updateLoadedUser:(newUserData:IUser)=>Promise<IUser>;
	updateLoadedUserPassword:(currentPassword:string, newPassword:string)=>Promise<IUser>;
	
	
	
	
	// When retrieving these relations, the full data will already have been loaded (as 
	// per the rules state for this interface). That being said, retrieval methods do 
	// not return promises.
	// -- Also, the retrieval methods will return undefined if not found
	
	
	getScale:(scaleID:string)=>IScale|undefined; //Will return undefined if not found
	createScale:(newScale:Omit<IScale, "id">)=>Promise<IScale>;
	updateScale:(currentScale:IScale, newScaleData:IScale)=>Promise<IScale>;
	deleteScale:(scale:IScale)=>Promise<IScale[]>;
	
	getCategory:(categoryID:string, scaleID:string)=>ICategory|undefined; //Will return undefined if not found
	createCategory:(parentScale:IScale, newCategory:Omit<ICategory, "id">)=>Promise<ICategory>;
	updateCategory:(parentScale:IScale, currentCategory:ICategory, newCategoryData:ICategory)=>Promise<ICategory>;
	deleteCategory:(parentScale:IScale, category:ICategory)=>Promise<ICategory[]>;
	
	getAction:(actionID:string, categoryID:string, scaleID:string)=>IAction|undefined; //Will return undefined if not found
	createAction:(parentScale:IScale, parentCategory:ICategory, newAction:Omit<IAction, "id">)=>Promise<IAction>;
	updateAction:(parentScale:IScale, parentCategory:ICategory, currentAction:IAction, newActionData:IAction)=>Promise<IAction>;
	deleteAction:(parentScale:IScale, parentCategory:ICategory, action:IAction)=>Promise<IAction[]>;
	
	//Get all timespans for a scale, in date order.
	getScaleTimespans:(scale:IScale, reverseOrder:boolean)=>({ timespan:ITimespan, category:ICategory, action:IAction })[];
	//At this time, you can replace timespans by deleting/creating, but not update
	createTimespan:(parentScale:IScale, parentCategory:ICategory, parentAction:IAction, newTimespan:Omit<ITimespan, "id">)=>Promise<ITimespan>;
	deleteTimespan:(parentScale:IScale, parentCategory:ICategory, parentAction:IAction, timespan:ITimespan)=>Promise<ITimespan[]>;
	
}


export default IUserService;