import IScale from './IScale';


interface IUser {
	id:string;
	email:string;
	forename:string;
	surname:string;
	scales:IScale[];
}

export default IUser;