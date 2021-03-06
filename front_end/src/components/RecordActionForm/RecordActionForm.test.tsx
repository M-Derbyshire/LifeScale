import RecordActionForm from './RecordActionForm';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const dummyEmpty = (x)=>{};
const dummySubmit = ()=>{};

const dummyTimespan = {
	id: "hasjkhdakjshd",
	date: new Date(),
	minuteCount: 2
};

const dummyCategories = [
	{
		id:"klasjdja", 
		name:"1", 
		color:"red", 
		desiredWeight:1, 
		actions:[
			{id:"lksd", name:"1", weight:1, timespans:[]},
			{id:"sAS", name:"2", weight:2, timespans:[]},
			{id:"werwer", name:"3", weight:3, timespans:[]}
		]
	},
	{
		id:"dskaskas", 
		name:"2", 
		color:"blue", 
		desiredWeight:2, 
		actions:[
			{id:"kjlj", name:"4", weight:1, timespans:[]},
			{id:"zcczc", name:"5", weight:2, timespans:[]},
			{id:"pioi", name:"6", weight:3, timespans:[]}
		]
	},
];


const dummyRecordedAction = {
	categories: dummyCategories,
	selectedCategoryID: dummyCategories[0].id,
	setSelectedCategoryID: dummyEmpty,
	selectedActionID: dummyCategories[0].actions[0].id,
	setSelectedActionID: dummyEmpty,
	timespan: dummyTimespan,
	setTimespan: dummyEmpty,
	minuteDisplayValue: dummyTimespan.minuteCount.toString(),
	setMinuteDisplayValue: dummyEmpty,
	hourDisplayValue: (dummyTimespan.minuteCount/60).toFixed(2),
	setHourDisplayValue: dummyEmpty,
	onSubmit: dummySubmit
}



test("RecordActionForm will call the onSubmit prop when submitted", () => {
	
	const mockSubmit = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, onSubmit: mockSubmit}} />);
	
	const formElement = container.querySelector("form");
	fireEvent.submit(formElement);
	
	expect(mockSubmit).toHaveBeenCalled();
	
});


test("RecordActionForm will call the disable submit button if actions are empty", () => {
	
	const mockSubmit = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										categories: [ { ...dummyCategories[0], actions: [] } ]
									}} />);
	
	const submit = container.querySelector("input[type=submit]");
	
	expect(submit).toBeDisabled();
	
});

test("RecordActionForm will call the disable submit button if categories are empty", () => {
	
	const mockSubmit = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										categories: []
									}} />);
	
	const submit = container.querySelector("input[type=submit]");
	
	expect(submit).toBeDisabled();
	
});




test("RecordActionForm will render the categories as options", () => {
	
	const { container } = render(<RecordActionForm 
									recordedAction={dummyRecordedAction} />);
	
	const categoryOptions = container.querySelectorAll(".categorySelect option");
	
	dummyCategories.forEach((cat, i) => {
		expect(categoryOptions[i].value).toBe(cat.id);
		expect(categoryOptions[i].textContent).toBe(cat.name);
	});
	
});

test.each(dummyCategories)("RecordActionForm will set the selected category to the given ID prop", (selectedCat) => {
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, selectedCategoryID: selectedCat.id}} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	
	expect(categorySelect.value).toBe(selectedCat.id);
	
});

test("RecordActionForm will call the setSelectedCategoryID prop when changing categories", () => {
	
	const selectedID = dummyCategories[0].id;
	const idToSelect = dummyCategories[1].id;
	
	const mockSetSelectedCategory = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										selectedCategoryID: selectedID,
										setSelectedCategoryID: mockSetSelectedCategory
									}} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	userEvent.selectOptions(categorySelect, idToSelect);
	
	expect(mockSetSelectedCategory).toHaveBeenCalledWith(idToSelect);
	
});




test("RecordActionForm will render the actions as options", () => {
	
	const { container } = render(<RecordActionForm recordedAction={dummyRecordedAction} />);
	
	const actionOptions = container.querySelectorAll(".actionSelect option");
	
	dummyCategories[0].actions.forEach((act, i) => {
		expect(actionOptions[i].value).toBe(act.id);
		expect(actionOptions[i].textContent).toBe(act.name);
	});
	
});

test.each(dummyCategories[0].actions)("RecordActionForm will set the selected action to the given ID prop", (selectedAct) => {
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										selectedActionID: selectedAct.id
									}} />);
	
	const actionSelect = container.querySelector(".actionSelect");
	
	expect(actionSelect.value).toBe(selectedAct.id);
	
});

test("RecordActionForm will call the setSelectedActionID prop when changing actions", () => {
	
	const selectedID = dummyCategories[0].actions[0].id;
	const idToSelect = dummyCategories[0].actions[1].id;
	
	const mockSetSelectedAction = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										selectedActionID: selectedID,
										setSelectedActionID: mockSetSelectedAction
									}} />);
	
	const actionSelect = container.querySelector(".actionSelect");
	userEvent.selectOptions(actionSelect, idToSelect);
	
	expect(mockSetSelectedAction).toHaveBeenCalledWith(idToSelect);
	
});




test.each([
	["1970-01-01"],
	["1970-01-02"]
])("RecordActionForm will display the given ITimespan date in a date input", (givenDate) => {
	
	const timespan = { date: new Date(givenDate), id: "test", minuteCount: 0 };
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, timespan}} />);
	
	const dateInput = container.querySelector(".actionDate");
	
	expect(dateInput.value).toBe(givenDate);
	
});

test("RecordActionForm will call the setTimespan prop, when changing the date, but without changing the time/id values", () => {
	
	const timespan = { date: new Date("1970-01-01"), id: "test", minuteCount: 52 };
	const newDate = "1971-02-02";
	const mockSetTimespan = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										timespan, 
										setTimespan: mockSetTimespan
									}} />);
	
	const dateInput = container.querySelector(".actionDate");
	fireEvent.change(dateInput, { target: { value: newDate } });
	
	expect(mockSetTimespan).toHaveBeenCalledWith({ ...timespan, date: new Date(newDate) });
	
});


test.each([
	[678],
	[345]
])("If usesTimespans is true, RecordActionForm will render a TimespanFormPartial, with the given minuteDisplayValue, and hourDisplayValue props", (minuteCount) => {
	
	const hourCount = (minuteCount/60).toFixed(2);
	
	const timespan = { date: new Date("1970-01-01"), id: "test", minuteCount: minuteCount };
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										timespan, 
										usesTimespans: true, 
										minuteDisplayValue: minuteCount.toString(),
										hourDisplayValue: hourCount 
									}} />);
	
	const timespanFormPartial = container.querySelector(".TimespanFormPartial");
	expect(timespanFormPartial).not.toBeNull();
	
	const minuteInput = screen.getByDisplayValue(minuteCount.toString());
	const hourInput = screen.getByDisplayValue(hourCount);
	expect(minuteInput).not.toBeNull();
	expect(hourInput).not.toBeNull();
});

test("If usesTimespans is false, RecordActionForm will not render a TimespanFormPartial", () => {
	
	const timespan = { date: new Date("1970-01-01"), id: "test", minuteCount: 1 };
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, timespan, usesTimespans: false}} />);
	
	
	const timespanFormPartial = container.querySelector(".TimespanFormPartial");
	expect(timespanFormPartial).toBeNull();
	
});

test("If usesTimespans prop is not given, RecordActionForm will not render a TimespanFormPartial", () => {
	
	const timespan = { date: new Date("1970-01-01"), id: "test", minuteCount: 1 };
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, timespan, usesTimespans: undefined}} />);
	
	const timespanFormPartial = container.querySelector(".TimespanFormPartial");
	expect(timespanFormPartial).toBeNull();
	
});

test("RecordActionForm will pass the hour/minute display values to TimespanFormPartial, with their setters", () => {
	
	const invalidNumberValue = "not a number";
	const newValue = "also not a number";
	
	const setMinuteDisplayValue = jest.fn();
	const setHourDisplayValue = jest.fn();
	
	const { container } = render(<RecordActionForm 
		recordedAction={{
			...dummyRecordedAction, 
			usesTimespans: true,
			minuteDisplayValue: invalidNumberValue, 
			hourDisplayValue: invalidNumberValue, 
			setMinuteDisplayValue, 
			setHourDisplayValue 
		}} />);
	
	const timepsanMinutesInput = container.querySelector(".timespanMinuteInput");
	const timepsanHoursInput = container.querySelector(".timespanHourInput");
	
	expect(timepsanMinutesInput.value).toEqual(invalidNumberValue);
	expect(timepsanHoursInput.value).toEqual(invalidNumberValue);
	
	fireEvent.change(timepsanMinutesInput, { target: { value: newValue } });
	fireEvent.change(timepsanHoursInput, { target: { value: newValue } });
	
	expect(setMinuteDisplayValue).toHaveBeenCalledWith(newValue);
	expect(setHourDisplayValue).toHaveBeenCalledWith(newValue);
	
});

test("RecordActionForm will pass the set timespan prop to TimespanFormPartial, but only the minuteCount and hour/minute display values will be affected", () => {
	
	const timespan = { date: new Date("1970-01-01"), id: "test", minuteCount: 10 };
	const newMinuteCount = 20;
	const mockSetTimespan = jest.fn();
	const mockSetMinuteDisplay = jest.fn();
	const mockSetHourDisplay = jest.fn();
	
	const { container } = render(<RecordActionForm 
									recordedAction={{
										...dummyRecordedAction, 
										timespan,
										setTimespan: mockSetTimespan,
										usesTimespans: true,
										setMinuteDisplayValue: mockSetMinuteDisplay,
										setHourDisplayValue: mockSetHourDisplay
									}} />);
	
	const timepsanMinutesInput = container.querySelector(".timespanMinuteInput");
	const timepsanHoursInput = container.querySelector(".timespanHourInput");
	fireEvent.change(timepsanMinutesInput, { target: { value: newMinuteCount } });
	
	expect(mockSetTimespan).toHaveBeenCalledWith({ ...timespan, minuteCount: newMinuteCount });
	expect(mockSetMinuteDisplay).toHaveBeenCalled();
	expect(mockSetHourDisplay).toHaveBeenCalled();
});



test.each([
	["test1"],
	["test2"]
])("RecordActionForm will render the given badSaveErrorMessage prop", (message) => {
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, badSaveErrorMessage: message}} />);
	
	const saveMessageDisplay = container.querySelector(".BadSaveMessage");
	
	expect(saveMessageDisplay).not.toBeNull();
	expect(saveMessageDisplay.textContent).toEqual(expect.stringContaining(message));
});

test.each([
	["test1"],
	["test2"]
])("RecordActionForm will render the given goodSaveMessage prop", (message) => {
	
	const { container } = render(<RecordActionForm 
									recordedAction={{...dummyRecordedAction, goodSaveMessage: message}} />);
	
	const saveMessageDisplay = container.querySelector(".GoodSaveMessage");
	
	expect(saveMessageDisplay).not.toBeNull();
	expect(saveMessageDisplay.textContent).toEqual(expect.stringContaining(message));
});