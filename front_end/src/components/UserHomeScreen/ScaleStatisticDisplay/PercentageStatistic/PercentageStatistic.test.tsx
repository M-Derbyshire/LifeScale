import PercentageStatistic from './PercentageStatistic';
import { render, screen } from '@testing-library/react';

const dummyStatistic = {
	label: "test",
	percentage: 1,
	id: "test"
}

test.each([
	["test1"],
	["test2"]
])("PercentageStatistic will display the given label text", (labelText) => {
	
	render(<PercentageStatistic statistic={{ ...dummyStatistic, label: labelText }} />)
	
	const labelElem = screen.getByText(labelText + ":");
	
	expect(labelElem).not.toBeNull();
	
});

test.each([
	[10],
	[20]
])("PercentageStatistic will display the given percentage", (percentage) => {
	
	render(<PercentageStatistic statistic={{ ...dummyStatistic, percentage }} />)
	
	const percentElem = screen.getByText(percentage.toString() + "%");
	
	expect(percentElem).not.toBeNull();
	
});

test.each([
	[100.501],
	[20.001],
	[1.123]
])("PercentageStatistic will cut the given percentage to 2 decimal places", (percentage) => {
	
	render(<PercentageStatistic statistic={{ ...dummyStatistic, percentage }} />)
	
	//The plus, before percentage is transormed, turns it back into a number, so no trailing zeros (e.g. 1.10)
	const percentElem = screen.getByText((+percentage.toFixed(2)) + "%");
	
	expect(percentElem).not.toBeNull();
	
});

test("PercentageStatistic will display the given children in a list of PercentageStatistics", () => {
	
	const children = [
		{ label: "testChild1", percentage: 11, id: "testChild1" },
		{ label: "testChild2", percentage: 12, id: "testChild2" }
	];
	
	const { container } = render(<PercentageStatistic statistic={{ ...dummyStatistic, children }} />)
	
	const childElems = container.querySelectorAll(".PercentageStatistic li .PercentageStatistic");
	
	expect(childElems.length).toBe(children.length);
	childElems.forEach((elem, idx) => {
		expect(elem.textContent).toEqual(expect.stringContaining(children[idx].label));
		expect(elem.textContent).toEqual(expect.stringContaining(children[idx].percentage.toString()));
	});
	
});