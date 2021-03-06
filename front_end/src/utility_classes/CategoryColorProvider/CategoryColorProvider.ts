import ICategoryColorData from '../../interfaces/UI/ICategoryColorData';

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
			{ colorName: "red", colorRealValue: "#FF4E4E", colorLabel: "" },
			{ colorName: "green", colorRealValue: "#69FF69", colorLabel: "" },
			{ colorName: "blue", colorRealValue: "#6178FF", colorLabel: "" },
			{ colorName: "cyan", colorRealValue: "#75FFFF", colorLabel: "" },
			{ colorName: "yellow", colorRealValue: "#F1F100", colorLabel: "" },
			{ colorName: "pink", colorRealValue: "#FF7CA8", colorLabel: "" },
			{ colorName: "purple", colorRealValue: "#FF62FF", colorLabel: "" },
			{ colorName: "orange", colorRealValue: "#FFC355", colorLabel: "" }
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
		const color = this._colorList.find(col => col.colorRealValue === realColor);
		return (color) ? color.colorName : undefined;
	}
	
};