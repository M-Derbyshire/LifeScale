import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import ITimespan from '../../interfaces/ITimespan';



/*
	This is a UserService implementation designed to interact with a JSON-Server mock 
	back end API.
	
	Note: As this is interacting with a mock API, certain functionality that would be in 
	a real API (such as validating logins, etc) will be handled by this instead (this is 
	purely designed for mocking a real back-end)
	
	For more information on why this is designed this way, see the IUserService 
	interface (/interfaces/api_access/IUserService).
*/
export default class MockJSONServerUserService implements IUserService {
	
	//Private properties not available for the JS version we're transpiling to
	_apiURLBase:string;
	
	constructor(apiProtocol:string, apiDomain:string, apiPort:string)
	{
		this._apiURLBase="";
	}
	
	loginUser(email:string, password:string)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	isLoggedIn()
	{
		throw new Error("Method not implemented");
		return false;
	}
	
	
	
	
	
	getLoadedUser()
	{
		throw new Error("Method not implemented");
		return {
			id:"test", 
			email:"test@test.com",
			forename:"test", 
			surname: "test",
			scales: []
		}
	}
	
	createUser(newUser: IUser & { password:string })
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	updateLoadedUser(newUserData:IUser)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	updateLoadedUserPassword(currentPassword:string, newPassword:string)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	
	
	
	createScale(newScale:IScale)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	updateScale(currentScale:IScale, newScaleData:IScale)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	deleteScale(scale:IScale)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	
	
	
	createCategory(newCategory:ICategory)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	updateCategory(currentCategory:ICategory, newCategoryData:ICategory)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	deleteCategory(category:ICategory)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	
	
	
	createAction(newAction:IAction)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	updateAction(currentAction:IAction, newActionData:IAction)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	deleteAction(action:IAction)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	
	
	
	createTimespan(newTimespan:ITimespan)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
	deleteTimespan(timespan:ITimespan)
	{
		throw new Error("Method not implemented");
		return new Promise(()=>{});
	}
	
}