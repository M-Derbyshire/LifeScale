import CategoryDetailsForm from './CategoryDetailsForm';
import { render, fireEvent } from '@testing-library/react';

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
