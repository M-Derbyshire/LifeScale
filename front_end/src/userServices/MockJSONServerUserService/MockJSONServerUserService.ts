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
	
	_abortControllers:AbortController[] = [];
	
	_isLoggedIn = false;
	
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
	
	
	//Call this before making any FETCH calls
	_getNewAbortController():AbortController
	{
		//First, clear out any controllers that have aborted
		//There's no way to tell if one's finished if it wasn't aborted, but we're not expecting more than 100 in one sitting
		this._abortControllers = this._abortControllers.filter(controller => !controller.signal.aborted);
		
		const newAbortController = new AbortController();
		this._abortControllers.push(newAbortController);
		
		return newAbortController;
	}
	
	abortRequests()
	{
		this._abortControllers.forEach(controller => controller.abort());
	}
	
	
	
	
	loginUser(email:string, password:string)
	{
		// ----------------------------------------------------------------------------------
		// As this is a mock API, for demonstration purposes this handles password validation
		// ----------------------------------------------------------------------------------
		
		const abortController = this._getNewAbortController();
		
		return fetch(`${this._apiURLBase}/users?email=${email}`, { signal: abortController.signal })
			.then(response => response.json())
			.then(users => {
				if(users.length === 0 || users[0].password !== password)
					throw new Error("The entered email or password is incorrect.");
				
				this._currentUserPassword = users[0].password;
				delete users[0].password;
				
				//The timespans will have strings as dates, rather than Date, so correct this
				users[0].scales.forEach((scale:IScale) => {
					scale.categories.forEach((cat:ICategory) => {
						cat.actions.forEach((act:IAction) => {
							act.timespans.forEach(ts => {
								ts.date = new Date(ts.date);
							});
						});
					});
				});
				
				this._currentUser = users[0];
				
				this._isLoggedIn = true;
				
				return users[0];
				
			}).catch(err => { throw err; });
	}
	
	logoutUser()
	{
		return new Promise<null>((resolve, reject) => {
			this._currentUser = undefined;
			this._isLoggedIn = false;
			resolve(null);
		});
	}
	
	isLoggedIn()
	{
		return this._isLoggedIn;
	}
	
	requestNewPassword(email:string)
	{
		return new Promise<null>((resolve, reject) => {
			reject(new Error("As this is an example system, with a mocked API, this feature cannot be implemented."));
		});
	}
	
	
	
	
	
	
	
	
	//If id is undefined, this will be treated as a new user
	_saveUser(newUserData: Omit<IUser, "id"> & { password:string }, id:string|undefined):Promise<IUser>
	{
		if(!newUserData.password)
			return new Promise((resolve, reject) => reject(new Error("The provided password was not valid")));
		
		const method = (!id) ? "POST" : "PUT";
		let url = `${this._apiURLBase}/users`;
		if(id)
			url += `/${id}`;
		
		
		
		const abortController = this._getNewAbortController();
		
		return fetch(url, {
			signal: abortController.signal,
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
		//First we need to make sure the email hasn't been used already. Then we can create the user
		
		const emailCheckAbortController = this._getNewAbortController();
		
		return fetch(`${this._apiURLBase}/users?email=${newUser.email}`, { signal: emailCheckAbortController.signal })
			.then(response => response.json())
			.then(users => {
				if(users.length > 0)
					throw new Error("The entered email is already in use.");
				
				
				//Now we return a promise to create the user
				return this._saveUser(newUser, undefined)
							.then(user => { 
								this._currentUser = user;
								this._currentUserPassword = newUser.password; //If we edit the user after registration, we don't want to blank the password
								return user;
							})
							.catch(err => { throw err; });
				
			}).catch(err => { throw err; });
	}
	
	updateLoadedUser(newUserData:IUser)
	{
		let userDataForUpdate:any = { ...newUserData };
		delete userDataForUpdate.id;
		
		// We don't want to run this yet, as first we need to check the email (if changed) isn't already in use
		const saveUserData = () => {
			return this._saveUser({ ...userDataForUpdate, password: this._currentUserPassword }, newUserData.id)
				.then(data => {
					this._currentUser = {
						...this._currentUser,
						...newUserData
					};
					
					return this._currentUser;
				})
				.catch(err => { throw err; });
		};
		
		
		
		if(newUserData.email !== this._currentUser!.email)
		{
			const emailCheckAbortController = this._getNewAbortController();
			
			return fetch(`${this._apiURLBase}/users?email=${newUserData.email}`, { signal: emailCheckAbortController.signal })
					.then(response => response.json())
					.then(users => {
						if(users.length > 0)
							throw new Error("The entered email is already in use.");
						
						return saveUserData();
					})
					.catch(err => {throw err;});
		}
		else
		{
			return saveUserData();
		}
		
	}
	
	updateLoadedUserPassword(currentPassword:string, newPassword:string)
	{
		return new Promise<IUser>((resolve, reject) => {
			
			// ----------------------------------------------------------------------------------
			// As this is a mock API, for demonstration purposes this handles password validation
			// ----------------------------------------------------------------------------------
			if(currentPassword !== this._currentUserPassword)
				reject(new Error("The current password provided is incorrect."));
			else
			{
				let userToSave:any = { ...this._currentUser!, password: newPassword };
				delete userToSave.id;
				
				this._saveUser(userToSave, this._currentUser!.id)
					.then(user => {
						this._currentUserPassword = newPassword;
						resolve(user);
					})
					.catch(err => reject(err));
			}
		});
	}
	
	
	
	
	
	/*
		Save an item to an array (such as a category to the user's scales, 
		for example) while maintaining consistency between this._currentUser 
		and the API's data.
		
		newItem should be an object, that requires an ID but doesn't currently have one
		entityTypeName could be "scale", "category", "action", etc (all lower case)
	*/
	_saveToArrayInCurrentUser(currentArray:any[], newItem:any, entityTypeName:string):Promise<any>
	{
		const originalArray = [...currentArray];
		
		//We need to generate IDs ourselves when it comes to internal arrays
		currentArray.push({...newItem, id: uuid() });
		
		let userToSave:any = { ...this._currentUser!, password: this._currentUserPassword };
		delete userToSave.id;
		
		return this._saveUser(userToSave, this._currentUser!.id)
			.then(user => currentArray[currentArray.length - 1])
			.catch(err => {
				currentArray = originalArray;
				throw new Error(`Error saving new ${entityTypeName}: ${err.message}`);
			});
	}
	
	/*
		Update an item in an array (such as a scale, category, action, timespan) 
		while maintaining consistency between this._currentUser and the API's data.
		
		currentItem and newItemData should both be objects.
		newItemData should match the interface of currentItem's type
		entityTypeName could be "scale", "category", "action", etc (all lower case)
	*/
	_updateArrayItemInCurrentUser(currentItem:any, newItemData:any, entityTypeName:string):Promise<any>
	{
		const originalItemData = { ...currentItem };
		
		//We can't just assign the new obj to the current (and spreading new obj won't work either)
		//as that will change the reference of currentItem to the reference of the new data obj, rather 
		//than changing the value of the current object to the new data values. (so the array item is 
		//still the same object).
		//Therefore, we need to explicitly set the values.
		for(let prop in newItemData)
		{
			currentItem[prop] = newItemData[prop];
		}
		
		let userToSave:any = { ...this._currentUser!, password: this._currentUserPassword };
		delete userToSave.id;
		
		return this._saveUser(userToSave, this._currentUser!.id)
			.then(user => currentItem)
			.catch(err => {
				for(let prop in originalItemData)
				{
					currentItem[prop] = originalItemData[prop];
				}
				throw new Error(`Error saving new ${entityTypeName}: ${err.message}`);
			});
	}
	
	/*
		Delete an item in an array (such as a scale, category, action, timespan) 
		while maintaining consistency between this._currentUser and the API's data.
		
		entityTypeName could be "scale", "category", "action", etc (all lower case)
	*/
	_deleteArrayItemInCurrentUser(containingArray:any[], itemToDelete:any, entityTypeName:string):Promise<any>
	{
		
		const originalArray = [...containingArray];
		
		
		//Need to filter the array to not include this item.
		//However, we need to not change the reference of containingArray
		//to a new array. Therefore, we need to clear then re-add the values 
		//into the array explicitly
		
		const clearCurrentArray = () => {
			while(containingArray.length) //Clear the array without referencing a new array
				containingArray.pop();
		};
		
		clearCurrentArray();
		
		//Refill array -- without this item -- while mainitaing correct reference
		originalArray.forEach((item) => {
			if(item !== itemToDelete) 
				containingArray.push(item)
		});
		
		
		
		let userToSave:any = { ...this._currentUser!, password: this._currentUserPassword };
		delete userToSave.id;
		
		return this._saveUser(userToSave, this._currentUser!.id)
			.then(user => containingArray)
			.catch(err => {
				clearCurrentArray();
				originalArray.forEach((item) => containingArray.push(item));
				throw new Error(`Error saving new ${entityTypeName}: ${err.message}`);
			});
		
	}
	
	
	
	
	
	
	getScale(scaleID:string) {
		try { return this._currentUser!.scales.find(scale => scale.id === scaleID); }
		catch (err) { return undefined; }
	}
	
	createScale(newScale:Omit<IScale, "id">):Promise<IScale> { 
		return this._saveToArrayInCurrentUser(this._currentUser!.scales, newScale, "scale");
	}
	
	updateScale(currentScale:IScale, newScaleData:IScale):Promise<IScale> {
		const scaleInternalObjectReference = this.getScale(currentScale.id);
		if(!scaleInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested scale.")));
		
		return this._updateArrayItemInCurrentUser(scaleInternalObjectReference, newScaleData, "scale");
	}
	
	deleteScale(scale:IScale):Promise<IScale[]> {
		return this._deleteArrayItemInCurrentUser(this._currentUser!.scales, scale, "scale");
	}
	
	
	
	
	
	
	getCategory(categoryID:string, scaleID:string) {
		try { return this.getScale(scaleID)!.categories.find(cat => cat.id === categoryID); }
		catch (err) { return undefined; }
	}
	
	createCategory(parentScale:IScale, newCategory:Omit<ICategory, "id">):Promise<ICategory> {
		const parentScaleInternalObjectReference = this.getScale(parentScale.id);
		if(!parentScaleInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested scale.")));
			
		return this._saveToArrayInCurrentUser(parentScaleInternalObjectReference.categories, newCategory, "category");
	}
	
	updateCategory(parentScale:IScale, currentCategory:ICategory, newCategoryData:ICategory):Promise<ICategory> {
		const categoryInternalObjectReference = this.getCategory(currentCategory.id, parentScale.id);
		if(!categoryInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested category.")));
		
		return this._updateArrayItemInCurrentUser(categoryInternalObjectReference, newCategoryData, "category");
	}
	
	deleteCategory(parentScale:IScale, category:ICategory):Promise<ICategory[]> {
		const parentScaleInternalObjectReference = this.getScale(parentScale.id);
		if(!parentScaleInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested scale.")));
		
		return this._deleteArrayItemInCurrentUser(parentScaleInternalObjectReference.categories, category, "category");
	}
	
	
	
	
	
	
	
	getAction(actionID:string, categoryID:string, scaleID:string) {
		try { return this.getCategory(categoryID, scaleID)!.actions.find(act => act.id === actionID); }
		catch (err) { return undefined; }
	}
	
	createAction(parentScale:IScale, parentCategory:ICategory, newAction:Omit<IAction, "id">):Promise<IAction> {
		const parentCategoryInternalObjectReference = this.getCategory(parentCategory.id, parentScale.id);
		if(!parentCategoryInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested category.")));
			
		return this._saveToArrayInCurrentUser(parentCategoryInternalObjectReference.actions, newAction, "action");
	}
	
	updateAction(parentScale:IScale, parentCategory:ICategory, currentAction:IAction, newActionData:IAction):Promise<IAction> {
		const actionInternalObjectReference = this.getAction(currentAction.id, parentCategory.id, parentScale.id);
		if(!actionInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested action.")));
		
		return this._updateArrayItemInCurrentUser(actionInternalObjectReference, newActionData, "action");
	}
	
	deleteAction(parentScale:IScale, parentCategory:ICategory, action:IAction):Promise<IAction[]> {
		const parentCategoryInternalObjectReference = this.getCategory(parentCategory.id, parentScale.id);
		if(!parentCategoryInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested category.")));
			
		return this._deleteArrayItemInCurrentUser(parentCategoryInternalObjectReference.actions, action, "action");
	}
	
	
	
	
	
	
	getScaleTimespans(scale:IScale, reverseOrder:boolean = false) {
		let allTimespansInfo = new Array<({ timespan:ITimespan, category:ICategory, action:IAction })>();
		
		scale.categories.forEach(
			cat => cat.actions.forEach(
				act => act.timespans.forEach(
					(timespan:ITimespan) => allTimespansInfo.push({
						 timespan, 
						 action: act, 
						 category: cat 
					})
				)
			)
		); 
		
		return allTimespansInfo.sort((a, b) => {
			//Get the milliseconds since 01/01/1970, and compare
			const aTimeMS = new Date(a.timespan.date).getTime();
			const bTimeMS = new Date(b.timespan.date).getTime();
			return (reverseOrder) ? (bTimeMS - aTimeMS) : (aTimeMS - bTimeMS);
		});
	}
	
	createTimespan(parentScale:IScale, parentCategory:ICategory, parentAction:IAction, newTimespan:Omit<ITimespan, "id">):Promise<ITimespan> {
		const parentActionInternalObjectReference = this.getAction(parentAction.id, parentCategory.id, parentScale.id);
		if(!parentActionInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested action.")));
			
		return this._saveToArrayInCurrentUser(parentActionInternalObjectReference.timespans, newTimespan, "timespan");
	}
	
	deleteTimespan(parentScale:IScale, parentCategory:ICategory, parentAction:IAction, timespan:ITimespan):Promise<ITimespan[]> {
		const parentActionInternalObjectReference = this.getAction(parentAction.id, parentCategory.id, parentScale.id);
		if(!parentActionInternalObjectReference)
			return new Promise((resolve, reject) => reject(new Error("Unable to find the requested action.")));
			
		return this._deleteArrayItemInCurrentUser(parentActionInternalObjectReference.timespans, timespan, "timespan");
	}
	
}