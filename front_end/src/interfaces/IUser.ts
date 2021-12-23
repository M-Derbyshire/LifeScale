import IScale from './IScale';


interface IUser {
	id:string;
	email:string;
	password:string;
	forename:string;
	surname:string;
	scales:IScale[];
}

export default IUser;