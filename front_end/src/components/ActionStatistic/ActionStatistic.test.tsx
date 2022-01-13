import ActionStatistic from './ActionStatistic';
import { render, screen } from '@testing-library/react';

test.each([
	["test1"],
	["test2"]
])("ActionStatistic will display the given label text prop", (labelText) => {
	
	render(<ActionStatistic statistic={{ label: labelText, percentage: 1 }} />)
	
	const labelElem = screen.getByText(labelText + ":");
	
	expect(labelElem).not.toBeNull();
	
});

test.each([
	[10],
	[20]
])("ActionStatistic will display the given percentage prop", (percentage) => {
	
	render(<ActionStatistic statistic={{ label: "test", percentage }} />)
	
	const percentElem = screen.getByText(percentage.toString() + "%");
	
	expect(percentElem).not.toBeNull();
	
});