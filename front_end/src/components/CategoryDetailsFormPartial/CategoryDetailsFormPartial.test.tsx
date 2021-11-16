import CategoryDetailsFormPartial from './CategoryDetailsFormPartial';
import { render, fireEvent } from '@testing-library/react';

const dummySetState = (x)=>{};

test.each([
	["test1"],
	["test2"]
])("CategoryDetailsFormPartial will set the name input value to the given name prop", (nameText) => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name={nameText}
		setName={dummySetState}
		color="#000000"
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState} />);
	
	const nameInput = container.querySelector(".categoryNameInput");
	
	expect(nameInput).not.toBeNull();
	expect(nameInput.value).toEqual(nameText);
});

test("CategoryDetailsFormPartial will call the setName callback when changing the name field", () => {
	
	const newVal = "newVal";
	const mockSetState = jest.fn();
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={mockSetState}
		color="#000000"
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState} />);
	
	const nameInput = container.querySelector(".categoryNameInput");
	
	fireEvent.change(nameInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});




test.each([
	["green"],
	["yellow"]
])("CategoryDetailsFormPartial will set the name input value to the given name prop", (optionVal) => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color={optionVal}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState} />);
	
	const colorInput = container.querySelector(".categoryColorInput");
	
	expect(colorInput).not.toBeNull();
	expect(colorInput.value).toEqual(optionVal);
});

test("CategoryDetailsFormPartial will call the setName callback when changing the name field", () => {
	
	//If this test breaks after you've changed the default option, change this (we need to check the default isn't
	//changed to the value we're trying to change the input to here)
	const defaultValue = "red";
	
	const newVal = "yellow";
	const mockSetState = jest.fn();
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color={defaultValue}
		setColor={mockSetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState} />);
	
	const colorInput = container.querySelector(".categoryColorInput");
	expect(colorInput.value).toEqual(defaultValue);
	
	fireEvent.change(colorInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});



test.each([
	["1"],
	["2"]
])("CategoryDetailsFormPartial renders the desiredWeight prop as the desiredWeight", (weightText) => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color="red"
		setColor={dummySetState}
		desiredWeight={weightText}
		setDesiredWeight={dummySetState} />);
	
	const weightInput = container.querySelector(".categoryDesiredWeightInput");
	
	expect(weightInput).not.toBeNull();
	expect(weightInput.value).toEqual(weightText);
	
});

test("CategoryDetailsFormPartial will use the setDesiredWeight prop as the desiredWeight onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = 2;
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color="red"
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={mockCB} />);
	
	const weightInput = container.querySelector(".categoryDesiredWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});

test("CategoryDetailsFormPartial will not allow weight to be a negative number (and will set the state to 0 instead)", () => {
	
	const mockCB = jest.fn();
	const newVal = -1;
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color="red"
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={mockCB} />);
	
	const weightInput = container.querySelector(".categoryDesiredWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(0);
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
});

test.each([
	[1.2, 1],
	[1.5, 2],
	[1.7, 2]
])("CategoryDetailsFormPartial will not allow weight to be a decimal number (will round the number instead)", (newVal, expectedVal) => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color="red"
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={mockCB} />);
	
	const weightInput = container.querySelector(".categoryDesiredWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
	expect(mockCB).toHaveBeenCalledWith(expectedVal);
});