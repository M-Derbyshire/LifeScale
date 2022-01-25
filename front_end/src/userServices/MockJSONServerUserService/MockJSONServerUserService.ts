import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import ITimespan from '../../interfaces/ITimespan';
import { v4 as uuid } from 'uuid';



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
	_apiURLBase:string; //The entry point of the URL (e.g. http://myapi.com:8080/v1)
	_currentUser?:IUser;
	_currentUserPassword:string = ""; //Aids with mocking password changes
	
	constructor(apiProtocol:string, apiDomain:string, apiPort?:string, apiPath?:string)
	{
		this._apiURLBase=`${apiProtocol}://${apiDomain}`;
		
		if(apiPort)
			this._apiURLBase += `:${apiPort}`;
		
		if(apiPath) 
			this._apiURLBase += `/${apiPath}`;
		
		if(this._apiURLBase.slice(-1) === "/")
			this._apiURLBase = this._apiURLBase.slice(0, -1);
	}
	
	
	
	
	
	
	loginUser(email:string, password:string)
	{
		// ----------------------------------------------------------------------------------
		// As this is a mock API, for demonstration purposes this handles password validation
		// ----------------------------------------------------------------------------------
		
		return fetch(`${this._apiURLBase}/users?email=${email}`)
			.then(response => response.json())
			.then(users => {
				if(users.length === 0 || users[0].password !== password)
					//See ILoginFailureInformation in IUserService module
					throw { isBadLogin: true, error: new Error("The entered email or password is incorrect.") };
				
				this._currentUserPassword = users[0].password;
				delete users[0].password;
				
				this._currentUser = users[0];
				
				return users[0];
				
			}).catch(err => { throw err; });
	}
	
	logoutUser()
	{
		return new Promise((resolve, reject) => {
			this._currentUser = undefined;
			resolve(null);
		});
	}
	
	isLoggedIn()
	{
		return !!this._currentUser;
	}
	
	requestNewPassword(email:string)
	{
		return new Promise((resolve, reject) => {
			reject(new Error("As this is an example system, with a mocked API, this feature cannot be implemented."));
		});
	}
	
	
	
	
	//If id is undefined, this will be treated as a new user
	_saveUser(newUserData: Omit<IUser, "id"> & { password:string }, id:string|undefined):Promise<any>
	{
		const method = (!id) ? "POST" : "PUT";
		let url = `${this._apiURLBase}/users`;
		if(id)
			url += `/${id}`;
		
		
		return fetch(url, {
			method,
			body: JSON.stringify(newUserData),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
			.then(data => { 
				if(data.password)
					delete data.password;
				
				return data; 
			})
			.catch(err => { throw err; });
	}
	
	
	
	
	
	getLoadedUser()
	{
		if(!this._currentUser)
			throw new Error("No logged in user has been found.");
		
		return this._currentUser;
	}
	
	createUser(newUser: Omit<IUser, "id"> & { password:string })
	{
		return this._saveUser(newUser, undefined)
			.then(user => { return user })
			.catch(err => { throw err; });
	}
	
	updateLoadedUser(newUserData:IUser)
	{
		let userDataForUpdate:any = { ...newUserData };
		delete userDataForUpdate.id;
		
		return this._saveUser({ ...userDataForUpdate, password: this._currentUserPassword }, newUserData.id)
			.then(data => {
				this._currentUser = {
					...this._currentUser,
					...newUserData
				};
				
				return this._currentUser;
			})
			.catch(err => { throw err; });
	}
	
	updateLoadedUserPassword(currentPassword:string, newPassword:string)
	{
		return new Promise((resolve, reject) => {
			
			// ----------------------------------------------------------------------------------
			// As this is a mock API, for demonstration purposes this handles password validation
			// ----------------------------------------------------------------------------------
			if(currentPassword !== this._currentUserPassword)
				//See IPasswordFailureInformation in IUserService module
				reject({ isBadPassword: true, error: new Error("The current password provided is incorrect.") });
			
			
			
			let userToSave:any = { ...this._currentUser!, password: newPassword };
			delete userToSave.id;
			
			this._saveUser(userToSave, this._currentUser!.id)
				.then(user => resolve(user))
				.catch(err => reject(err));
		});
	}
	
	
	
	
	
	//newItem should be an object, that requires an ID but doesn't currently have one
	//entityTypeName could be "scale", "category", "action", etc (all lower case)
	_saveToArrayInCurrentUser(currentArray:any[], newItem:any, entityTypeName:string):Promise<any>
	{
		const originalArray = [...currentArray];
		
		//We need to generate IDs ourselves when it comes to internal arrays
		currentArray.push({...newItem, id: uuid() });
		
		let userToSave:any = { ...this._currentUser!, password: this._currentUserPassword };
		delete userToSave.id;
		
		return this._saveUser(userToSave, this._currentUser!.id)
			.then(user => currentArray)
			.catch(err => {
				currentArray = originalArray;
				throw new Error(`Error saving new ${entityTypeName}: ${err.message}`);
			});
	}
	
	
	createScale(newScale:Omit<IScale, "id">) { 
		return this._saveToArrayInCurrentUser(this._currentUser!.scales, newScale, "scale");
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
	
	
	
	
	createCategory(newCategory:Omit<ICategory, "id">)
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
	
	
	
	
	createAction(newAction:Omit<IAction, "id">)
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
	
	
	
	
	createTimespan(newTimespan:Omit<ITimespan, "id">)
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