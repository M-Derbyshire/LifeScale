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
	goodSaveMessage: "test good save"
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