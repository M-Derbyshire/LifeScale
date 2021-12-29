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


test.each([
	["1/1/2021", "1/1/2021"], //These are in the date format that should be displayed
	["12/29/2021", "29/12/2021"]
])("ActionHistoryItem will display the given timespan date in the right format", (dateIn, dateDisplayed) => {
	
	const { container } = render(<ActionHistoryItem
									categoryName="test"
									actionName="test"
									timespan={{ ...dummyTimespan, date: new Date(dateIn) }}
									deleteHandler={dummyDeleteHandler} />);
	
	const dateDisplay = container.querySelector(".itemDateDisplay");
	
	expect(dateDisplay.textContent).toEqual(expect.stringContaining(dateDisplayed));
	
});