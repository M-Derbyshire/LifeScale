

interface ICategoryColorData {
	colorName:string; //The name of the color (to be stored in the database)
	colorRealValue:string; // The real CSS color to display
	getColorLabel:()=>string; // Get a formatted name of this color (for use in select drop-downs, etc)
};

/*
	The values stored in the database for ICategory colors will need to be consistent (though more can be 
	added, without issue), however the actual color values themselves will need to be able to change, based 
	on design needs.
	
	Therefore, an instance of this class will provide the "real values" for a given color name (or vice-versa).
	
	This means the stored color name (the consistent data over time) can be converted back and forth to the 
	potentially changing CSS colors that are actually displayed
*/
export default class CategoryColorProvider
{
	
	colorList:ICategoryColorData[];
		
	constructor()
	{
		this.colorList = [
			
		];
	}
	
	
	getColorList():ICategoryColorData[]
	{
		throw new Error("Not implemented");
		return [];
	}
	
	//Returns undefined if no result found
	getRealColorFromName(colorName:string):string|undefined
	{
		throw new Error("Not implemented");
		return undefined;
	}
	
	//Returns undefined if no result found
	getNameFromRealColor(realColor:string):string|undefined
	{
		throw new Error("Not implemented");
		return undefined;
	}
	
};