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


test("CategoryDetailsForm will call the backButtonHandler prop if the back button is clicked", () => {
	
	const mockBackHandler = jest.fn();
	
	const { container } = render(<ScaleDetailsForm 
				scaleItem={dummyScaleItem} 
				headingText="test"
				backButtonHandler={mockBackHandler} />);
	
	const backButton = container.querySelector(".scaleBackButton");
	fireEvent.click(backButton);
	
	expect(mockBackHandler).toHaveBeenCalled();
});
