import ActionStatistic from './ActionStatistic';
import { render, screen } from '@testing-library/react';

test.each([
	["test1"],
	["test2"]
])("ActionStatistic will display the given label text props", (labelText) => {
	
	render(<ActionStatistic label={labelText} percentage={1} />)
	
	const labelElem = screen.getByText(labelText);
	
	expect(labelElem).not.toBeNull();
	
});