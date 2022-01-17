//ScaleBalanceItems represent an item (say, a category) to be placed on a scale display
interface IScaleBalanceItem {
	label:string; //The name or title of the scale
	weight:number; //A number to represent the weight. 
					//This could be a percentage, a fraction, an int (as long as the type of number used is 
					//consistent for every item)
	color:string; //CSS color to be used for the item
}

export default IScaleBalanceItem;