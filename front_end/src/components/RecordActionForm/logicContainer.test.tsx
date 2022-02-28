import RecordActionFormLogicContainer from './RecordActionFormLogicContainer';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


const dummyScaleUsesTimespans = {
	id: "scaleTest3920912931-293",
	name: "Work/Life",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [
		{
			id: "testCat23132948284",
			name: "work",
			color: "red",
			desiredWeight: 1,
			actions: [
				{
					id: "testAct94092384092348",
					name: "employment",
					weight: 3,
					timespans: [
						{
							id: "testTime329874920384",
							date: "2021-01-22",
							minuteCount: 450
						}
					]
				},
				{
					id: "testAct389345809348",
					name: "personal work",
					weight: 1,
					timespans: [
						{
							id: "testTime34059309855880",
							date: "2021-01-21",
							minuteCount: 120
						}
					]
				}
			]
		},
		{
			id: "testCat28329723479274",
			name: "life",
			color: "blue",
			desiredWeight: 1.5,
			actions: [
				{
					id: "testAct583928474485385",
					name: "tv",
					weight: 1,
					timespans: [
						{
							id: "testTime23842984098",
							date: "2021-01-22",
							minuteCount: 90
						},
						{
							id: "testTime43489238482384",
							date: "2021-01-21",
							minuteCount: 95
						}
					]
				},
				{
					id: "testAct3213233",
					name: "gaming",
					weight: 1,
					timespans: [
						{
							id: "testTime23842984098",
							date: "2021-01-22",
							minuteCount: 90
						},
						{
							id: "testTime43489238482384",
							date: "2021-01-21",
							minuteCount: 95
						}
					]
				},
				{
					id: "testAct5839485385",
					name: "sleep",
					weight: 3,
					timespans: [
						{
							id: "testTime9284093840",
							date: "2021-01-22",
							minuteCount: 450
						},
						{
							id: "testTime28409238480",
							date: "2021-01-21",
							minuteCount: 450
						}
					]
				}
			]
		}
	]
};

const dummyScaleNotTimespans = {
	...dummyScaleUsesTimespans,
	usesTimespans: false
};


test("RecordActionFormLogicContainer will render a RecordActionForm, and handle the state/submission", () => {
	
	const scale = dummyScaleUsesTimespans;
	
	const newDateValue = "2010-12-01";
	const newMinuteValue = 150;
	const expectedCategory = scale.categories[1];
	const expectedAction = scale.categories[1].actions[1];
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
	
	mockUserService.getAction = (actID, catID, scaleID) => expectedAction;
	mockUserService.getCategory = (catID, scaleID) => expectedCategory;
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	const categoryOptions = container.querySelectorAll(".categorySelect option");
	const actionSelect = container.querySelector(".actionSelect");
	const actionOptions = container.querySelectorAll(".actionSelect option");
	const dateInput = container.querySelector(".actionDate");
	const timepsanMinutesInput = container.querySelector(".timespanMinuteInput");
	const form = container.querySelector("form");
	
	//Check the categories are all there as options
	//Check the selected is the first
	//Change the selected to the second
	scale.categories.forEach((cat, i) => {
		expect(categoryOptions[i].value).toBe(cat.id);
		expect(categoryOptions[i].textContent).toBe(cat.name);
	});
	expect(categorySelect.value).toBe(scale.categories[0].id);
	userEvent.selectOptions(categorySelect, scale.categories[1].id);
	
	//Check the actions are all there as options
	//Check the selected is the first
	//Change the selected to the second
	scale.categories[0].actions.forEach((act, i) => {
		expect(actionOptions[i].value).toBe(act.id);
		expect(actionOptions[i].textContent).toBe(act.name);
	});
	expect(actionSelect.value).toBe(scale.categories[1].actions[0].id);
	userEvent.selectOptions(actionSelect, scale.categories[1].actions[1].id);
	
	fireEvent.change(dateInput, { target: { value: newDateValue } });
	fireEvent.change(timepsanMinutesInput, { target: { value: newMinuteValue } });
	
	fireEvent.submit(form);
	
	//The first parameter will confirm that the correct categories/actions have been selected
	expect(mockUserService.createTimespan).toHaveBeenCalledWith(scale, expectedCategory, expectedAction, {
		date: new Date(newDateValue),
		minuteCount: newMinuteValue
	});
});

test("If not using timespans, RecordActionFormLogicContainer will set minute count to 1", () => {
	
	const scale = dummyScaleNotTimespans;
	
	const newDateValue = "2010-12-01";
	const expectedAction = scale.categories[1].actions[1];
	const expectedCategory = scale.categories[1];
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
	
	mockUserService.getAction = (actID, catID, scaleID) => expectedAction;
	mockUserService.getCategory = (catID, scaleID) => expectedCategory;
	
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	const actionSelect = container.querySelector(".actionSelect");
	const dateInput = container.querySelector(".actionDate");
	const form = container.querySelector("form");
	
	expect(categorySelect.value).toBe(scale.categories[0].id);
	expect(actionSelect.value).toBe(scale.categories[0].actions[0].id);
	
	fireEvent.change(dateInput, { target: { value: newDateValue } });
	
	fireEvent.submit(form);
	
	expect(mockUserService.createTimespan).toHaveBeenCalledWith(scale, expectedCategory, expectedAction, {
		date: new Date(newDateValue),
		minuteCount: 1
	});
	
});

test.each([
	[true],
	[false]
])("RecordActionFormLogicContainer will pass the usesTimespans value to RecordActionForm", (usesTimespans) => {
	
	const scale = (usesTimespans) ? dummyScaleUsesTimespans : dummyScaleNotTimespans;
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={new TestingDummyUserService()}
									scale={scale} />);
	
	if(usesTimespans)
	{
		expect(container.querySelector(".TimespanFormPartial")).not.toBeNull();
	}
	else
	{
		expect(container.querySelector(".TimespanFormPartial")).toBeNull();
	}
	
});

test("RecordActionFormLogicContainer will pass in all the categories from the scale to the RecordActionForm", () => {
	
	const scale = dummyScaleUsesTimespans;
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={new TestingDummyUserService()}
									scale={scale} />);
	
	const categoryOptions = container.querySelectorAll(".categorySelect option");
	
	scale.categories.forEach((cat, i) => {
		expect(categoryOptions[i].value).toBe(cat.id);
		expect(categoryOptions[i].textContent).toBe(cat.name);
	});
	
});

test("RecordActionFormLogicContainer will set the selected category and action to be the first ones in those arrays", () => {
	
	const scale = dummyScaleUsesTimespans;
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={new TestingDummyUserService()}
									scale={scale} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	const actionSelect = container.querySelector(".actionSelect");
	
	expect(categorySelect.value).toBe(scale.categories[0].id);
	expect(actionSelect.value).toBe(scale.categories[0].actions[0].id);
	
});

test("In RecordActionFormLogicContainer, if the user has no categories, the selected category will be an empty string", () => {
	
	const scale = { ...dummyScaleUsesTimespans, categories: [] };
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={new TestingDummyUserService()}
									scale={scale} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	
	expect(categorySelect.value).toBe("");
	
});

test("In RecordActionFormLogicContainer, if the category has no actions, the selected action will be an empty string", () => {
	
	const scale = { ...dummyScaleUsesTimespans, categories: [{
		id: "testCat23132948284",
		name: "work",
		color: "red",
		desiredWeight: 1,
		actions:[]
	}] };
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={new TestingDummyUserService()}
									scale={scale} />);
	
	const actionSelect = container.querySelector(".actionSelect");
	
	expect(actionSelect.value).toBe("");
	
});

test("In RecordActionFormLogicContainer, if the category is changed, the selected action will become the first action of the category", () => {
	
	const scale = { ...dummyScaleUsesTimespans, categories: [{
		id: "testCat23132948284",
		name: "work",
		color: "red",
		desiredWeight: 1,
		actions:[]
	},{
		id: "testCat42384727",
		name: "life",
		color: "red",
		desiredWeight: 1,
		actions:[{
			id: "testAct87348273",
			name: "testAct",
			weight: 1,
			timespans: []
		}]
	}] };
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={new TestingDummyUserService()}
									scale={scale} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	const actionSelect = container.querySelector(".actionSelect");
	
	userEvent.selectOptions(categorySelect, scale.categories[1].name);
	
	expect(actionSelect.value).toBe(scale.categories[1].actions[0].id);
	
});


test("RecordActionFormLogicContainer will pass the successful save message to RecordActionForm to be rendered", async () => {
	
	const scale = dummyScaleUsesTimespans;
	const message = "Action saved successfully.";
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
	
	mockUserService.getAction = (actID, catID, scaleID) => scale.categories[0].actions[0];
	mockUserService.getCategory = (catID, scaleID) => scale.categories[0];
	
	
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	const recordActionForm = container.querySelector(".RecordActionForm");
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => expect(recordActionForm.textContent).toEqual(expect.stringContaining(message)));
	
});

test("RecordActionFormLogicContainer will pass the failed save message to RecordActionForm to be rendered", async () => {
	
	const scale = dummyScaleUsesTimespans;
	const message = "Error while saving.";
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.createTimespan = jest.fn().mockRejectedValue(new Error(message));
	mockUserService.getAction = (actID, catID, scaleID) => scale.categories[0].actions[0];
	mockUserService.getCategory = (catID, scaleID) => scale.categories[0];
	
	
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	const recordActionForm = container.querySelector(".RecordActionForm");
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => expect(recordActionForm.textContent).toEqual(expect.stringContaining(message)));
	
});

test("RecordActionFormLogicContainer will blank the form after a successful save", async () => {
	
	const scale = dummyScaleUsesTimespans;
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
	
	mockUserService.getAction = (actID, catID, scaleID) => scale.categories[0].actions[0];
	mockUserService.getCategory = (catID, scaleID) => scale.categories[0];
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	//Get the inputs, and store their values
	const categorySelect = container.querySelector(".categorySelect");
	const categoryOriginalValue = categorySelect.value;
	const actionSelect = container.querySelector(".actionSelect");
	const actionOriginalValue = actionSelect.value;
	const dateInput = container.querySelector(".actionDate");
	const dateOriginalValue = dateInput.value;
	const timepsanMinutesInput = container.querySelector(".timespanMinuteInput");
	const minutesOriginalValue = timepsanMinutesInput.value;
	const form = container.querySelector(".RecordActionForm form");
	
	
	//Set the values, then submit the form
	expect(categorySelect.value).toBe(scale.categories[0].id);
	userEvent.selectOptions(categorySelect, scale.categories[1].id);
	expect(actionSelect.value).toBe(scale.categories[1].actions[0].id);
	userEvent.selectOptions(actionSelect, scale.categories[1].actions[1].id);
	
	const newDateValue = "2010-12-01";
	const newMinuteValue = 150;
	fireEvent.change(dateInput, { target: { value: newDateValue } });
	fireEvent.change(timepsanMinutesInput, { target: { value: newMinuteValue } });
	
	
	fireEvent.submit(form);
	
	
	//These should revert back to their original values
	await waitFor(() => {
		expect(categorySelect.value).toBe(categoryOriginalValue);
		expect(actionSelect.value).toBe(actionOriginalValue);
		expect(dateInput.value).toBe(dateOriginalValue);
		expect(timepsanMinutesInput.value).toBe(minutesOriginalValue);
	});
	
});

test("RecordActionFormLogicContainer will not blank the form after a failed save", async () => {
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
	
	const scale = dummyScaleUsesTimespans;
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	//Get the inputs, and store their values
	const categorySelect = container.querySelector(".categorySelect");
	const categoryOriginalValue = categorySelect.value;
	const actionSelect = container.querySelector(".actionSelect");
	const actionOriginalValue = actionSelect.value;
	const dateInput = container.querySelector(".actionDate");
	const dateOriginalValue = dateInput.value;
	const timepsanMinutesInput = container.querySelector(".timespanMinuteInput");
	const minutesOriginalValue = timepsanMinutesInput.value;
	const form = container.querySelector(".RecordActionForm form");
	
	
	//Set the values, then submit the form
	expect(categorySelect.value).toBe(scale.categories[0].id);
	userEvent.selectOptions(categorySelect, scale.categories[1].id);
	expect(actionSelect.value).toBe(scale.categories[1].actions[0].id);
	userEvent.selectOptions(actionSelect, scale.categories[1].actions[1].id);
	
	const newDateValue = "2010-12-01";
	const newMinuteValue = 150;
	fireEvent.change(dateInput, { target: { value: newDateValue } });
	fireEvent.change(timepsanMinutesInput, { target: { value: newMinuteValue } });
	
	
	fireEvent.submit(form);
	
	
	//These should not revert back to their original values
	await waitFor(() => {
		expect(categorySelect.value).not.toBe(categoryOriginalValue);
		expect(actionSelect.value).not.toBe(actionOriginalValue);
		expect(dateInput.value).not.toBe(dateOriginalValue);
		expect(timepsanMinutesInput.value).not.toBe(minutesOriginalValue);
	});
	
});


test("RecordActionFormLogicContainer will call the onSuccessfulSave prop on successful save", async () => {
	
	const scale = dummyScaleUsesTimespans;
	
	const mockSaveCallback = jest.fn();
	
	const mockUserService = new TestingDummyUserService();
	
	mockUserService.createTimespan = jest.fn().mockResolvedValue({
		id: "testTimespan",
		date: new Date().toString(),
		minuteCount: 0
	});
	
	mockUserService.getAction = (actID, catID, scaleID) => scale.categories[0].actions[0];
	mockUserService.getCategory = (catID, scaleID) => scale.categories[0];
	
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale}
									onSuccessfulSave={mockSaveCallback} />);
	
	const recordActionForm = container.querySelector(".RecordActionForm");
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => expect(mockSaveCallback).toHaveBeenCalled());
	
});

test("RecordActionFormLogicContainer will not call the onSuccessfulSave prop on failed save", async () => {
	
	const mockSaveCallback = jest.fn();
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.createTimespan = jest.fn().mockRejectedValue(new Error("Test"));
	
	const scale = dummyScaleUsesTimespans;
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale}
									onSuccessfulSave={mockSaveCallback} />);
	
	const recordActionForm = container.querySelector(".RecordActionForm");
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => expect(mockSaveCallback).not.toHaveBeenCalled());
	
});



test("RecordActionFormLogicContainer will not call createTimespan if no category available, and will display an error", async () => {
	
	const message = "No category has been selected.";
	
	const scale = { ...dummyScaleUsesTimespans, categories: [] };
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.createTimespan = jest.fn();
	mockUserService.getCategory = (catID, scaleID) => undefined;
	mockUserService.getAction = (actID, catID, scaleID) => dummyScaleUsesTimespans.categories[0].actions[0];
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	const recordActionForm = container.querySelector(".RecordActionForm");
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(mockUserService.createTimespan).not.toHaveBeenCalled();
		expect(recordActionForm.textContent).toEqual(expect.stringContaining(message));
	});
	
});

test("RecordActionFormLogicContainer will not call createTimespan if no action available, and will display an error", async () => {
	
	const message = "No action has been selected.";
	
	const scale = { ...dummyScaleUsesTimespans, categories: [{
		id: "testCat23132948284",
		name: "work",
		color: "red",
		desiredWeight: 1,
		actions:[]
	}] };
	
	const mockUserService = new TestingDummyUserService();
	mockUserService.createTimespan = jest.fn();
	mockUserService.getCategory = (catID, scaleID) => scale.categories[0];
	mockUserService.getAction = (actID, catID, scaleID) => undefined;
	
	
	const { container } = render(<RecordActionFormLogicContainer
									userService={mockUserService}
									scale={scale} />);
	
	const recordActionForm = container.querySelector(".RecordActionForm");
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	await waitFor(() => {
		expect(mockUserService.createTimespan).not.toHaveBeenCalled();
		expect(recordActionForm.textContent).toEqual(expect.stringContaining(message));
	});
	
});