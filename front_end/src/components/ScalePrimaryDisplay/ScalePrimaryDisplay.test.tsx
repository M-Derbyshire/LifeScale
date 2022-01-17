import ScalePrimaryDisplay from './ScalePrimaryDisplay';
import { render, fireEvent } from '@testing-library/react';

const dummyCallback = ()=>{};

const balanceTestsEachArray = [
	[
		[
			{ label: "test1", color: "red", weight: 1 },
			{ label: "test2", color: "blue", weight: 2 }
		]
	],
	[
		[
			{ label: "test3", color: "yellow", weight: 3 },
			{ label: "test4", color: "green", weight: 4 }
		]
	]
];

test.each(balanceTestsEachArray)("ScalePrimaryDisplay will pass the given scale items to the desired balance scale", (items) => {
	
	const { container } = render(<ScalePrimaryDisplay 
									desiredBalanceItems={items} 
									currentBalanceItems={[]}
									editScaleCallback={dummyCallback} />);
	
	const balanceScale = container.querySelector(".desiredBalanceContainer .ScaleBalanceDisplay");
	
	items.forEach(item => expect(balanceScale.textContent).toEqual(expect.stringContaining(item.label)));
	
});


test.each(balanceTestsEachArray)("ScalePrimaryDisplay will pass the given scale items to the current balance scale", (items) => {
	
	const { container } = render(<ScalePrimaryDisplay 
									desiredBalanceItems={[]} 
									currentBalanceItems={items}
									editScaleCallback={dummyCallback} />);
	
	const balanceScale = container.querySelector(".currentBalanceContainer .ScaleBalanceDisplay");
	
	items.forEach(item => expect(balanceScale.textContent).toEqual(expect.stringContaining(item.label)));
	
});


test("ScalePrimaryDisplay will call the given editScaleCallback when the edit scale button is clicked", () => {
	
	const mockCallback = jest.fn();
	
	const { container } = render(<ScalePrimaryDisplay 
									desiredBalanceItems={[]} 
									currentBalanceItems={[]}
									editScaleCallback={mockCallback} />);
	
	const button = container.querySelector(".editScaleButton");
	fireEvent.click(button);
	
	expect(mockCallback).toHaveBeenCalled();
	
});