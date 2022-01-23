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
				
				if(users[0].password)
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
	
	
	
	
	//If isNewUser is true, this will POST rather than PUT
	_saveUser(newUserData: Omit<IUser, "id"> & { password:string }, isNewUser:boolean):Promise<any>
	{
		const method = (isNewUser) ? "POST" : "PUT";
		
		return fetch(`${this._apiURLBase}/users`, {
			method,
			body: JSON.stringify(newUserData),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
			.then(data => { return data; })
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
		return this._saveUser(newUser, true)
			.then(user => { return user })
			.catch(err => { throw err; });
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