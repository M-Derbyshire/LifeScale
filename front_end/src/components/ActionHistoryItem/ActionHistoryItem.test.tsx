import ActionHistoryItem from './ActionHistoryItem';
import { render, fireEvent } from '@testing-library/react';

const dummyTimespan = { date: new Date(), minuteCount: 60, id: "test" };
const dummyDeleteHandler = () => {};

test.each([
	["test1"],
	["test2"]
])("ActionHistoryItem will display the given categoryName", (catName) => {
	
	const { container } = render(<ActionHistoryItem
									categoryName={catName}
									actionName="test"
									timespan={dummyTimespan}
									deleteHandler={dummyDeleteHandler} />);
	
	const categoryDisplay = container.querySelector(".itemCategoryNameDisplay");
	
	expect(categoryDisplay.textContent).toEqual(expect.stringContaining(catName));
	
});


test.each([
	["test1"],
	["test2"]
])("ActionHistoryItem will display the given actionName", (actName) => {
	
	const { container } = render(<ActionHistoryItem
									categoryName="test"
									actionName={actName}
									timespan={dummyTimespan}
									deleteHandler={dummyDeleteHandler} />);
	
	const actionDisplay = container.querySelector(".itemActionNameDisplay");
	
	expect(actionDisplay.textContent).toEqual(expect.stringContaining(actName));
	
});