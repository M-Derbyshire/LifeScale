import CategoryColorProvider from './CategoryColorProvider';
import ICategoryColorData from '../../interfaces/UI/ICategoryColorData';


/*
	Sub-class of CategoryColorProvider, however the color list here is provided through 
	the constructor. This is designed to be used when testing components that make use 
	of CategoryColorProvider.
	
	See description of CategoryColorProvider for more information.
*/
export default class TestCategoryColorProvider extends CategoryColorProvider {
	
	constructor(colorList:ICategoryColorData[])
	{
		super();
		
		this._colorList = colorList;
	}
	
};