import ICategory from './ICategory';

/*
Represents a "scale" object. "usesTimespans" is a boolean that tells the application
if that scale should give the option to set the minute count when creating timespans (if not,
the minute count should default to 1). "displayDayCount" is the amount of days worth of
timespans that should be taken into account when calculating timespan statistics, to be
displayed to the user.
*/
interface IScale {
	id:string;
	name:string;
	usesTimespans:boolean;
	displayDayCount:number;
	categories:ICategory[];
}

export default IScale;