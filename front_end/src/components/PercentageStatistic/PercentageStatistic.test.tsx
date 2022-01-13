import PercentageStatistic from './PercentageStatistic';
import { render, screen } from '@testing-library/react';

test.each([
	["test1"],
	["test2"]
])("PercentageStatistic will display the given label text prop", (labelText) => {
	
	render(<PercentageStatistic statistic={{ label: labelText, percentage: 1 }} />)
	
	const labelElem = screen.getByText(labelText + ":");
	
	expect(labelElem).not.toBeNull();
	
});

test.each([
	[10],
	[20]
])("PercentageStatistic will display the given percentage prop", (percentage) => {
	
	render(<PercentageStatistic statistic={{ label: "test", percentage }} />)
	
	const percentElem = screen.getByText(percentage.toString() + "%");
	
	expect(percentElem).not.toBeNull();
	
});