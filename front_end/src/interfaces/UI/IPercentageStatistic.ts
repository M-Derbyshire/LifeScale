interface IPercentageStatistic {
	label:string;
	percentage:number;
	children?:IPercentageStatistic[]
}

export default IPercentageStatistic;