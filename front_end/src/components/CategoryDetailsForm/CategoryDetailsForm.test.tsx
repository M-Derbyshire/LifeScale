import CategoryDetailsForm from './CategoryDetailsForm';
import { render, fireEvent, screen } from '@testing-library/react';
import CategoryColorProvider from '../../utility_classes/CategoryColorProvider/CategoryColorProvider';

const dummyBackHandler = () => {};
const dummySubmit = () => {};
const dummySetState = (x) => {};


const dummyColorProvider = new CategoryColorProvider();
const dummyColorList = dummyColorProvider.getColorList();


const dummyCategoryFormItem = {
	name: "Test category",
	setName: dummySetState,
	color: dummyColorList[0].colorRealValue,
	setColor: dummySetState,
	desiredWeight: 1,
	setDesiredWeight: dummySetState,
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
	const heading = container.querySelector("h1");
	
	expect(heading.textContent).toEqual(headText);
	
});


test("CategoryDetailsForm will call the backButtonHandler prop if the back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={mockBackHandler}
				colorList={dummyColorList} />);
	
	const backButton = container.querySelector(".categoryBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
});



test("CategoryDetailsForm will render content in a LoadedContentWrapper", () => {
	
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
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
				badLoadErrorMessage={messageText}
				colorList={dummyColorList} />);
	
	const contentWrapper = container.querySelector(`.LoadedContentWrapper`);
	const messageElem = screen.getByText(messageText);
	
	expect(contentWrapper).not.toBeNull();
	expect(messageElem).not.toBeNull();
	
});

test("CategoryDetailsForm will not render anything in LoadedContentWrapper, when not passed a categoryItem or badLoadErrorMessage", () => {
	
	const { container } = render(<CategoryDetailsForm 
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
	const loadingDisplay = container.querySelector(`.currentlyLoadingDisplay`);
	
	expect(loadingDisplay).not.toBeNull();
});




test("CategoryDetailsForm will render a CategoryDetailsFormPartial", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem} 
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
	const formPartial = container.querySelector(".CategoryDetailsFormPartial");
	
	expect(formPartial).not.toBeNull();
	
});

test("CategoryDetailsForm will pass the category details to CategoryDetailsFormPartial", () => {
	
	const name = "testname";
	const mockSetName = jest.fn();
	const weight = 1000000;
	const mockSetWeight = jest.fn();
	const color = dummyColorList[0].colorRealValue;
	const mockSetColor = jest.fn();
	
	const newName = "testnewname";
	const newWeight = 5000000;
	const newColor = dummyColorList[1].colorRealValue; //If there's less than 2 colors, something bigger has 
														//gone wrong somewhere, so this should be a warning sign
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
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
				backButtonHandler={dummyBackHandler} 
				colorList={dummyColorList} />);
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
	const saveMessage = container.querySelector(".GoodSaveMessage");
	
	expect(saveMessage).not.toBeNull();
	expect(saveMessage.textContent).toEqual(expect.stringContaining(message));
	
});




test("CategoryDetailsForm will enable the submit button if no disableSubmit prop is passed in", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("CategoryDetailsForm will enable the submit button if the disableSubmit prop is passed false", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				disableSubmit={false}
				colorList={dummyColorList} />);
	
	const submitButton = container.querySelector("input[type=submit]");
	expect(submitButton).not.toBeDisabled();
	
});

test("CategoryDetailsForm will disable the submit button if the disableSubmit prop is passed true", () => {
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				disableSubmit={true}
				colorList={dummyColorList} />);
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
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
				backButtonHandler={dummyBackHandler}
				colorList={dummyColorList} />);
	
	const deleteButton = container.querySelector(".categoryDeleteButton");
	
	fireEvent.click(deleteButton);
	
	expect(mockDelete).toHaveBeenCalled();
	
});



test("CategoryDetailsForm will render the given actionsForm prop", () => {
	
	const testText = "testing text in place of action form";
	
	const { container } = render(<CategoryDetailsForm 
				categoryItem={dummyCategoryFormItem}
				headingText={"test"}
				backButtonHandler={dummyBackHandler}
				actionsForm={(<div>{testText}</div>)}
				colorList={dummyColorList} />);
	
	const textElement = screen.getByText(testText);
	
	expect(textElement).not.toBeNull();
	
});

test.each([
	[
		[
			{ colorName: "red", colorRealValue: "#ff5555", colorLabel: "RedLabel" },
			{ colorName: "green", colorRealValue: "#55ff55", colorLabel: "GreenLabel" }
		]
	],
	[
		[
			{ colorName: "green", colorRealValue: "#55ff55", colorLabel: "GreenLabel" },
			{ colorName: "red", colorRealValue: "#ff5555", colorLabel: "RedLabel" }
		]
	]
])("CategoryDetailsForm will pass in the colorList prop to CategoryDetailsForm", (mockColorList) => {
		
	const { container } = render(<CategoryDetailsForm 
			categoryItem={{ ...dummyCategoryFormItem, color: mockColorList[0].colorRealValue }}
			headingText={"test"}
			backButtonHandler={dummyBackHandler}
			colorList={mockColorList} />);
	
	const colorInputOptions = container.querySelectorAll(".categoryColorInput option");
	
	expect(colorInputOptions.length).toBe(mockColorList.length);
	
	mockColorList.forEach((mockColor, i) => {
		expect(colorInputOptions[i].value).toBe(mockColor.colorRealValue);
		expect(colorInputOptions[i].textContent).toEqual(expect.stringContaining(mockColor.colorLabel));
	});
	
});