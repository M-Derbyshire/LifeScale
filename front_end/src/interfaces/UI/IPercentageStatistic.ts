interface IPercentageStatistic {
	id:string;
	label:string;
	percentage:number;
	children?:IPercentageStatistic[]
}

export default IPercentageStatistic;