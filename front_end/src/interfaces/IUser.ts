
interface IUser {
	id:string; //Using string, in case these are used with UUIDs in a no-sql system, in the future
	email:string;
	password:string;
	forename:string;
	surname:string;
}

export default IUser;