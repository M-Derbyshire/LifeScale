

interface ICategoryColorData {
	colorName:string; //The name of the color (to be stored in the database)
	colorRealValue:string; // The real CSS color to display
	colorLabel:string; // A formatted name of this color (for use in select drop-downs, etc)
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
	
	_colorList:ICategoryColorData[];
		
	constructor()
	{
		this._colorList = [
			{ colorName: "red", colorRealValue: "#ff5555", colorLabel: "" },
			{ colorName: "green", colorRealValue: "#55ff55", colorLabel: "" },
			{ colorName: "blue", colorRealValue: "#5555ff", colorLabel: "" }
		];
		
		//Create the color labels
		this._colorList = this._colorList.map(
			col => ({ ...col, colorLabel: this._formatColorNameToLabel(col.colorName) })
		);
	}
	
	
	
	_formatColorNameToLabel(name:string):string
	{
		return name.charAt(0).toUpperCase() + name.slice(1);
	}
	
	
	getColorList():ICategoryColorData[]
	{
		return this._colorList;
	}
	
	//Returns undefined if no result found
	getRealColorFromName(colorName:string):string|undefined
	{
		const color = this._colorList.find(col => col.colorName === colorName);
		return (color) ? color.colorRealValue : undefined;
	}
	
	//Returns undefined if no result found
	getNameFromRealColor(realColor:string):string|undefined
	{
		throw new Error("Not implemented");
		return undefined;
	}
	
};