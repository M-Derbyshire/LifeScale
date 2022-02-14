import CategoryColorProvider from './CategoryColorProvider';


test("CategoryColorProvider getColorList will return an array of ICategoryColorData items", () => {
	
	const provider = new CategoryColorProvider();
	
	const list = provider.getColorList();
	
	expect(list.length).toBeGreaterThan(0);
	
	list.forEach(col => {
		expect(col.colorName).toBeTruthy();
		expect(col.colorRealValue).toBeTruthy();
		expect(col.colorLabel.toLowerCase()).toEqual(expect.stringContaining(col.colorName));
	});
	
});

test("CategoryColorProvider getColorList will return valid CSS colors", () => {
	
	const provider = new CategoryColorProvider();
	
	const list = provider.getColorList();
	
	expect(list.length).toBeGreaterThan(0);
	
	list.forEach(col => {
		const elem = document.createElement("div");
		elem.style.color = col.colorRealValue;
		expect(elem.style.color).not.toEqual("");
	});
	
});


test("CategoryColorProvider getRealColorFromName will return the color that matches the name", () => {
	
	const provider = new CategoryColorProvider();
	
	const list = provider.getColorList();
	
	expect(list.length).toBeGreaterThan(0);
	
	list.forEach(col => {
		const realColor = provider.getRealColorFromName(col.colorName);
		expect(realColor).toEqual(col.colorRealValue);
	});
	
});

test("CategoryColorProvider getRealColorFromName will return undefined if no matching color found", () => {
	
	const name = "nonExsistentColor";
	
	const provider = new CategoryColorProvider();
	
	const realColor = provider.getRealColorFromName(name);
	
	expect(realColor).toBeUndefined();
	
});