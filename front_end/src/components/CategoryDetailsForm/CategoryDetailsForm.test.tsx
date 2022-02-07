import CategoryDetailsForm from './CategoryDetailsForm';
import { render, fireEvent, screen } from '@testing-library/react';

const dummyBackHandler = () => {};
const dummySubmit = () => {};
const dummySetState = (x) => {};

const dummyCategoryFormItem = {
	name: "Test category",
	setName: dummySetState,
	color: "red",
	setColor: dummySetState,
	desiredWeight: 1,
	setDesiredWeight: dummySetState,
	
	newAction: {
		name: "test new act",
		setName: dummySetState,
		weight: 1,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit,
		badSaveErrorMessage: "test bad save",
		goodSaveMessage: "test good save"
	},
	actions: [{
		name: "test act 1",
		setName: dummySetState,
		weight: 1,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit,
		badSaveErrorMessage: "test bad save",
		goodSaveMessage: "test good save"
	}, {
		name: "test act 2",
		setName: dummySetState,
		weight: 1,
		setWeight: dummySetState,
		onSubmit: dummySubmit,
		onDelete: dummySubmit,
		badSaveErrorMessage: "test bad save",
		goodSaveMessage: "test good save"
	}],
	
	onSubmit: dummySubmit,
	onDelete: dummySubmit,
	badSaveErrorMessage: "Test bad save",
	goodSaveMessage: "Test good save"
};






test.each([
	["test1"],
	["test2"]
])("CategoryDetailsForm will set the h1 text to the given headingText prop", (headText) => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={headText}
				backButtonHandler={dummyBackHandler} />);
	
	const heading = container.querySelector("h1");
	
	expect(heading.textContent).toEqual(headText);
	
});


test("CategoryDetailsForm will call the backButtonHandler prop if the back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={mockBackHandler} />);
	
	const backButton = container.querySelector(".categoryBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
});



test("CategoryDetailsForm will render content in a LoadedContentWrapper", () => {
	
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const nameInput = screen.getByDisplayValue(dummyCategoryFormItem.name);
	
	expect(contentWrapper).not.toBeNull();
	expect(nameInput).not.toBeNull();
	
});

test.each([
	["message 1"],
	["message 2"]
])("CategoryDetailsForm will render passed badLoadErrorMessage prop in a LoadedContentWrapper", (messageText) => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				badLoadErrorMessage={messageText} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const messageElem = screen.getByText(messageText);
	
	expect(contentWrapper).not.toBeNull();
	expect(messageElem).not.toBeNull();
	
});

test("CategoryDetailsForm will not render anything in LoadedContentWrapper, when not passed a categoryItem or badLoadErrorMessage", () => {
	
	const { container } = render(<CategoryDetailsForm 
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const loadingDisplay = container.querySelector(`.currentlyLoadingDisplay`);
	
	expect(loadingDisplay).not.toBeNull();
});




test("CategoryDetailsForm will render a CategoryDetailsFormPartial", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const formPartial = container.querySelector(".CategoryDetailsFormPartial");
	
	expect(formPartial).not.toBeNull();
	
});

test("CategoryDetailsForm will pass the category details to CategoryDetailsFormPartial", () => {
	
	const name = "testname";
	const mockSetName = jest.fn();
	const weight = 1000000;
	const mockSetWeight = jest.fn();
	const color = "red";
	const mockSetColor = jest.fn();
	
	const newName = "testnewname";
	const newWeight = 5000000;
	const newColor = "blue";
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
					name, 
					setName: mockSetName,
					desiredWeight: weight, 
					setDesiredWeight: mockSetWeight,
					color,
					setColor: mockSetColor
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const nameInput = screen.getByDisplayValue(name);
	fireEvent.change(nameInput, { target: { value: newName } });
	expect(mockSetName).toHaveBeenCalledWith(newName);
	
	//Color input
	const colorInput = container.querySelector(".CategoryDetailsFormPartial select");
	fireEvent.change(colorInput, { target: { value: newColor } });
	expect(mockSetColor).toHaveBeenCalledWith(newColor);
	
	const desiredWeightInput = screen.getByDisplayValue(weight);
	fireEvent.change(desiredWeightInput, { target: { value: newWeight } });
	expect(mockSetWeight).toHaveBeenCalledWith(newWeight);
	
});



test.each([
	["test message 1"],
	["test message 2"]
])("CategoryDetailsForm will display the given badSaveErrorMessage prop in a BadSaveMessage", (message) => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
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
])("CategoryDetailsForm will display the given goodSaveMessage prop in a GoodSaveMessage", (message) => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
					goodSaveMessage: message
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const saveMessage = container.querySelector(".GoodSaveMessage");
	
	expect(saveMessage).not.toBeNull();
	expect(saveMessage.textContent).toEqual(expect.stringContaining(message));
	
});




test("CategoryDetailsForm will enable the submit button if no disableSubmit prop is passed in", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("CategoryDetailsForm will enable the submit button if the disableSubmit prop is passed false", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				disableSubmit={false} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("CategoryDetailsForm will disable the submit button if the disableSubmit prop is passed true", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				disableSubmit={true} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).toBeDisabled();
	
});

test("CategoryDetailsForm will call the onSubmit callback, if the submit button is clicked", () => {
	
	const mockSubmit = jest.fn();
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
					onSubmit: mockSubmit
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	expect(mockSubmit).toHaveBeenCalled();
	
});




test("CategoryDetailsForm will not render a delete button if no onDelete prop given", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
					onDelete: undefined
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const deleteButton = container.querySelector(".categoryDeleteButton");
	
	expect(deleteButton).toBeNull();
	
});

test("CategoryDetailsForm will render a delete button if onDelete prop given", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
					onDelete: ()=>{}
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const deleteButton = container.querySelector(".categoryDeleteButton");
	
	expect(deleteButton).not.toBeNull();
	
});

test("CategoryDetailsForm delete button will call onDelete prop", () => {
	
	const mockDelete = jest.fn();
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={{
					...dummyCategoryFormItem, 
					onDelete: mockDelete
				}}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const deleteButton = container.querySelector(".categoryDeleteButton");
	
	fireEvent.click(deleteButton);
	
	expect(mockDelete).toHaveBeenCalled();
	
});



test("CategoryDetailsForm will render an ActionsForm", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const actionsForm = container.querySelector(".ActionsForm");
	
	expect(actionsForm).not.toBeNull();
	
});

test("CategoryDetailsForm will pass the actions to ActionsForm", () => {
	
	render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	dummyCategoryFormItem.actions.forEach(
		(act) => expect(screen.getByDisplayValue(act.name)).not.toBeNull()
	);
	
});

test("CategoryDetailsForm will pass the newAction to ActionsForm", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler} />);
	
	const newActionButton = container.querySelector(".newActionButton");
	fireEvent.click(newActionButton);
	
	expect(screen.getByDisplayValue(dummyCategoryFormItem.newAction.name)).not.toBeNull()
	
});