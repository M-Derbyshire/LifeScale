/*
Used to represent a percentage statistic's information (such as label
and percentage). A percentage statistic can have a further breakdown of the data it
represents, so the "children" property can store inner statistics.
*/
interface IPercentageStatistic {
	id:string;
	label:string;
	percentage:number;
	children?:IPercentageStatistic[]
}

export default IPercentageStatistic;