
/*
Represents an actual recorded event. The default value for "minuteCount" should be 1.
*/
interface ITimespan {
	id:string;
	date:Date;
	minuteCount:number;
}

export default ITimespan;