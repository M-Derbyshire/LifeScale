interface ICategoryColorData {
	colorName:string; //The name of the color (to be stored in the database)
	colorRealValue:string; // The real CSS color to display
	colorLabel:string; // A formatted name of this color (for use in select drop-downs, etc)
};

export default ICategoryColorData;