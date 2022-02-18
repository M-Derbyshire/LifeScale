import IUserService from '../../interfaces/api_access/IUserService';
import IUser from '../../interfaces/IUser';
import IScale from '../../interfaces/IScale';
import ICategory from '../../interfaces/ICategory';
import IAction from '../../interfaces/IAction';
import ITimespan from '../../interfaces/ITimespan';



// This implementation of IUserService is here for use in tests.
// Tests can create an instance of this, then overwrite the required
// methods with mocks.
export default class TestingDummyUserService implements IUserService {
	
	_dummyUser:IUser = {
		id: "mock-user",
		email: "mock@user.com",
		forename: "mock",
		surname: "user",
		scales: []
	};
	
	
	loginUser(email:string, password:string)
	{
		return new Promise<IUser>((resolve, reject) => {
			resolve(this._dummyUser);
		});
	}
	
	logoutUser()
	{
		return new Promise<null>((resolve, reject) => {
			resolve(null);
		});
	}
	
	isLoggedIn()
	{
		return false;
	}
	
	requestNewPassword(email:string)
	{
		return new Promise<null>((resolve, reject) => {
			resolve(null);
		});
	}
	
	
	
	getLoadedUser()
	{
		return this._dummyUser;
	}
	
	createUser(newUser: Omit<IUser, "id"> & { password:string })
	{
		return new Promise<IUser>((resolve, reject) => {
			resolve(this._dummyUser);
		});
	}
	
	updateLoadedUser(newUserData:IUser)
	{
		return new Promise<IUser>((resolve, reject) => {
			resolve(this._dummyUser);
		});
	}
	
	updateLoadedUserPassword(currentPassword:string, newPassword:string)
	{
		return new Promise<IUser>((resolve, reject) => {
			resolve(this._dummyUser);
		});
	}
	
	
	getScale(scaleID:string):IScale|undefined {
		return undefined;
	}
	
	createScale(newScale:Omit<IScale, "id">) { 
		return new Promise<IScale>((resolve, reject) => {
			resolve({ ...newScale, id: "test" });
		});
	}
	
	updateScale(currentScale:IScale, newScaleData:IScale) {
		return new Promise<IScale>((resolve, reject) => {
			resolve(newScaleData);
		});
	}
	
	deleteScale(scale:IScale) {
		return new Promise<IScale[]>((resolve, reject) => {
			resolve(this._dummyUser.scales);
		});
	}
	
	
	getCategory(categoryID:string, scaleID:string):ICategory|undefined {
		return undefined;
	}
	
	createCategory(parentScale:IScale, newCategory:Omit<ICategory, "id">) {
		return new Promise<ICategory>((resolve, reject) => {
			resolve({ ...newCategory, id: "test" });
		});
	}
	
	updateCategory(currentCategory:ICategory, newCategoryData:ICategory) {
		return new Promise<ICategory>((resolve, reject) => {
			resolve(newCategoryData);
		});
	}
	
	deleteCategory(parentScale:IScale, category:ICategory) {
		return new Promise<ICategory[]>((resolve, reject) => {
			resolve(parentScale.categories);
		});
	}
	
	
	getAction(actionID:string, categoryID:string, scaleID:string):|undefined {
		return undefined;
	}
	
	createAction(parentScale:IScale, parentCategory:ICategory, newAction:Omit<IAction, "id">) {
		return new Promise<IAction>((resolve, reject) => {
			resolve({ ...newAction, id: "test" });
		});
	}
	
	updateAction(parentScale:IScale, parentCategory:ICategory, currentAction:IAction, newActionData:IAction) {
		return new Promise<IAction>((resolve, reject) => {
			resolve(newActionData);
		});
	}
	
	deleteAction(parentScale:IScale, parentCategory:ICategory, action:IAction) {
		return new Promise<IAction[]>((resolve, reject) => {
			resolve(parentCategory.actions);
		});
	}
	
	
	getScaleTimespans(scale:IScale, reverseOrder:boolean = false) {
		return [];
	}
	
	createTimespan(parentScale:IScale, parentCategory:ICategory, parentAction:IAction, newTimespan:Omit<ITimespan, "id">) {
		return new Promise<ITimespan>((resolve, reject) => {
			resolve({ ...newTimespan, id: "test" });
		});
	}
	
	deleteTimespan(parentScale:IScale, parentCategory:ICategory, parentAction:IAction, timespan:ITimespan) {
		return new Promise<ITimespan[]>((resolve, reject) => {
			resolve(parentAction.timespans);
		});
	}
	
	
}