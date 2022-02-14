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