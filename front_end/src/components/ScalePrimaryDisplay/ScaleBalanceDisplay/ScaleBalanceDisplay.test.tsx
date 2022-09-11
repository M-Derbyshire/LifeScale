import ScaleBalanceDisplay from './ScaleBalanceDisplay';
import { render, screen } from '@testing-library/react';

test("ScaleBalanceDisplay will display all given items, with their label text", () => {
	
	const items = [
		{ label: "test1", weight: 1, color: "red" },
		{ label: "test2", weight: 2, color: "blue" },
		{ label: "test3", weight: 3, color: "green" },
	];
	
	render(<ScaleBalanceDisplay scaleItems={items} />);
	
	items.forEach( item => expect(screen.getByText(item.label).closest("div")).not.toBeNull() );
	
});


test.each([
	{ label: "test1", weight: 1, color: "red" },
	{ label: "test2", weight: 2, color: "blue" },
	{ label: "test3", weight: 3, color: "green" }
])("ScaleBalanceDisplay will set the background color with the given color", (item) => {
	
	render(<ScaleBalanceDisplay scaleItems={[item]} />);
	
	const itemElem = screen.getByText(item.label).closest("div");
	
	expect(itemElem.style).toHaveProperty("backgroundColor", item.color);
	
});


test.each([
	{ label: "test1", weight: 1, color: "red" },
	{ label: "test2", weight: 2, color: "blue" },
	{ label: "test3", weight: 3, color: "green" }
])("ScaleBalanceDisplay will set the flex-grow with the given weight", (item) => {
	
	render(<ScaleBalanceDisplay scaleItems={[item]} />);
	
	const itemElem = screen.getByText(item.label).closest("div");
	
	expect(itemElem.style).toHaveProperty("flexGrow", item.weight.toString());
	
});