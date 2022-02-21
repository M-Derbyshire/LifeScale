import ScaleDetailsForm from './ScaleDetailsForm';
import { render, fireEvent, screen } from '@testing-library/react';

const dummyBackHandler = () => {};
const dummySubmit = () => {};
const dummySetState = (x) => {};

const dummyScaleItem = {
	name: "testScale",
	setName: dummySetState,
	usesTimespans: true,
	setUsesTimespans: dummySetState,
	dayCount: 7,
	setDayCount: dummySetState,
	
	categories: [
		{
			id: "testcat1",
			name: "test cat 1",
			color: "red",
			desiredWeight: 1,
			actions: []
		},
		{
			id: "testcat2",
			name: "test cat 2",
			color: "red",
			desiredWeight: 1,
			actions: []
		}
	],
	
	onSubmit: dummySubmit,
	onDelete: dummySubmit,
	badSaveErrorMessage: "test bad save",
	goodSaveMessage: "test good save",
	
	addCategoryCallback: dummySubmit,
	editCategoryCallback: dummySetState
};


test.each([
	["test1"],
	["test2"]
])("ScaleDetailsForm will set the h1 text to the given headingText prop", (headText) => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem} 
				headingText={headText}
				backButtonHandler={dummyBackHandler} />);
	
	const heading = container.querySelector("h1");
	
	expect(heading.textContent).toEqual(headText);
	
});


test("ScaleDetailsForm will call the backButtonHandler prop if the back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem} 
				headingText="test"
				backButtonHandler={mockBackHandler} />);
	
	const backButton = container.querySelector(".scaleBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
});




test("ScaleDetailsForm will render content in a LoadedContentWrapper", () => {
	
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const nameInput = screen.getByDisplayValue(dummyScaleItem.name);
	
	expect(contentWrapper).not.toBeNull();
	expect(nameInput).not.toBeNull();
	
});

test.each([
	["message 1"],
	["message 2"]
])("ScaleDetailsForm will render passed badLoadErrorMessage prop in a LoadedContentWrapper", (messageText) => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				badLoadErrorMessage={messageText} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const messageElem = screen.getByText(messageText);
	
	expect(contentWrapper).not.toBeNull();
	expect(messageElem).not.toBeNull();
	
});

test("ScaleDetailsForm will not render anything in LoadedContentWrapper, when not passed a scaleItem or badLoadErrorMessage", () => {
	
	const { container } = render(<ScaleDetailsForm 
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const loadingDisplay = container.querySelector(`.currentlyLoadingDisplay`);
	
	expect(loadingDisplay).not.toBeNull();
});




test("ScaleDetailsForm will render a ScaleDetailsFormPartial", () => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const formPartial = container.querySelector(".ScaleDetailsFormPartial");
	
	expect(formPartial).not.toBeNull();
	
});

test("ScaleDetailsForm will pass the scale details to ScaleDetailsFormPartial", () => {
	
	const name = "testname";
	const mockSetName = jest.fn();
	const dayCount = 1000000;
	const mockSetDayCount = jest.fn();
	const usesTimespans = true;
	const mockSetUsesTimespans = jest.fn();
	
	const newName = "testnewname";
	const newDayCount = 5000000;
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={{
					name,
					setName: mockSetName,
					usesTimespans,
					setUsesTimespans: mockSetUsesTimespans,
					dayCount,
					setDayCount: mockSetDayCount,
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const nameInput = screen.getByDisplayValue(name);
	fireEvent.change(nameInput, { target: { value: newName } });
	expect(mockSetName).toHaveBeenCalledWith(newName);
	
	const dayInput = screen.getByDisplayValue(dayCount);
	fireEvent.change(dayInput, { target: { value: newDayCount } });
	expect(mockSetDayCount).toHaveBeenCalledWith(newDayCount);
	
	const usesTimespansInput = container.querySelector("input[type=checkBox]");
	fireEvent.click(usesTimespansInput);
	expect(mockSetUsesTimespans).toHaveBeenCalledWith(!usesTimespans);
	
});



test.each([
	["test message 1"],
	["test message 2"]
])("ScaleDetailsForm will display the given badSaveErrorMessage prop in a BadSaveMessage", (message) => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					badSaveErrorMessage: message
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const errorMessage = container.querySelector(".BadSaveMessage");
	
	expect(errorMessage).not.toBeNull();
	expect(errorMessage.textContent).toEqual(expect.stringContaining(message));
	
});

test.each([
	["test message 1"],
	["test message 2"]
])("ScaleDetailsForm will display the given goodSaveMessage prop in a GoodSaveMessage", (message) => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					goodSaveMessage: message
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const saveMessage = container.querySelector(".GoodSaveMessage");
	
	expect(saveMessage).not.toBeNull();
	expect(saveMessage.textContent).toEqual(expect.stringContaining(message));
	
});



test("ScaleDetailsForm will enable the submit button if no disableSubmit prop is passed in", () => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("ScaleDetailsForm will enable the submit button if the disableSubmit prop is passed false", () => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				disableSubmit={false} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("ScaleDetailsForm will disable the submit button if the disableSubmit prop is passed true", () => {
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				disableSubmit={true} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).toBeDisabled();
	
});

test("ScaleDetailsForm will call the onSubmit callback, if the submit button is clicked", () => {
	
	const mockSubmit = jest.fn();
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					onSubmit: mockSubmit
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	expect(mockSubmit).toHaveBeenCalled();
	
});



test("ScaleDetailsForm will not render a delete button if no onDelete prop given", () => {
	
	render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					onDelete: undefined
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const deleteButton = screen.queryByRole("button", { name: /delete/i });
	
	expect(deleteButton).toBeNull();
	
});

test("ScaleDetailsForm will render a delete button if onDelete prop given", () => {
	
	render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					onDelete: ()=>{}
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const deleteButton = screen.queryByRole("button", { name: /delete/i });
	
	expect(deleteButton).not.toBeNull();
	
});

test("ScaleDetailsForm delete button will call onDelete prop", () => {
	
	const mockDelete = jest.fn();
	
	render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					onDelete: mockDelete
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const deleteButton = screen.queryByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	expect(mockDelete).toHaveBeenCalled();
	
});



test("ScaleDetailsForm will now render a CardDisplay (with the given categories and an AddItemCard) as children", () => {
	
	const mockEditCallback = jest.fn();
	const mockAddCallback = jest.fn();
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={{
					...dummyScaleItem, 
					editCategoryCallback: mockEditCallback,
					addCategoryCallback: mockAddCallback
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	
	const cardDisplay = container.querySelector(".CardDisplay");
	expect(cardDisplay).not.toBeNull();
	
	
	
	const addItemCard = container.querySelector(".CardDisplay .AddItemCard");
	expect(addItemCard).not.toBeNull();
	
	fireEvent.click(addItemCard);
	expect(mockAddCallback).toHaveBeenCalled();
	
	
	const categoryCards = container.querySelectorAll(".CardDisplay .EditableItemCard");
	const categoryCardButtons = container.querySelectorAll(".CardDisplay .EditableItemCard button");
	expect(categoryCards.length).toBe(dummyScaleItem.categories.length);
	
	categoryCards.forEach((card, i) => {
		
		expect(card.textContent).toEqual(expect.stringContaining(dummyScaleItem.categories[i].name));
		
		fireEvent.click(categoryCardButtons[i]);
		expect(mockEditCallback).toHaveBeenCalledWith(dummyScaleItem.categories[i].id);
	});
	
	
});

test("ScaleDetailsForm will hide the categories section, if hideCategories is true", () => {

	const { container } = render(<ScaleDetailsForm 
		scaleItem={dummyScaleItem}
		headingText={"test"}
		backButtonHandler={dummyBackHandler}
		hideCategories={true} />);
	
	expect(container.querySelector(".CardDisplay")).toBeNull();

});