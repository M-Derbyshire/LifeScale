import CategoryDetailsFormPartial from './CategoryDetailsFormPartial';
import { render, fireEvent } from '@testing-library/react';

const dummySetState = (x)=>{};

const dummyColorList = [
	{ colorName: "red", colorRealValue: "#ff5555", colorLabel: "RedLabel" },
	{ colorName: "green", colorRealValue: "#55ff55", colorLabel: "GreenLabel" },
	{ colorName: "blue", colorRealValue: "#5555ff", colorLabel: "BlueLabel" },
];

test.each([
	["test1"],
	["test2"]
])("CategoryDetailsFormPartial will set the name input value to the given name prop", (nameText) => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name={nameText}
		setName={dummySetState}
		color={dummyColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState}
		colorList={dummyColorList} />);
	
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
		color={dummyColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState}
		colorList={dummyColorList} />);
	
	const nameInput = container.querySelector(".categoryNameInput");
	
	fireEvent.change(nameInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
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
])("CategoryDetailsFormPartial will render the colors as options in the color select", (mockColorList) => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color={mockColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState}
		colorList={mockColorList} />);
	
	const colorInputOptions = container.querySelectorAll(".categoryColorInput option");
	
	expect(colorInputOptions.length).toBe(mockColorList.length);
	
	mockColorList.forEach((mockColor, i) => {
		expect(colorInputOptions[i].value).toBe(mockColor.colorRealValue);
		expect(colorInputOptions[i].textContent).toEqual(expect.stringContaining(mockColor.colorLabel));
	});
	
});


test.each([
	[dummyColorList[0].colorRealValue],
	[dummyColorList[1].colorRealValue]
])("CategoryDetailsFormPartial will set the color input value to the given color prop", (optionVal) => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color={optionVal}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState}
		colorList={dummyColorList} />);
	
	const colorInput = container.querySelector(".categoryColorInput");
	
	expect(colorInput).not.toBeNull();
	expect(colorInput.value).toEqual(optionVal);
});


test("CategoryDetailsFormPartial will set the color input value to the first color in the given list, if the passed value is an empty string", () => {
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color=""
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState}
		colorList={dummyColorList} />);
	
	const colorInput = container.querySelector(".categoryColorInput");
	
	expect(colorInput).not.toBeNull();
	expect(colorInput.value).toEqual(dummyColorList[0].colorRealValue);
});


test("CategoryDetailsFormPartial will call the setColor callback when changing the color field", () => {
	
	const startValue = dummyColorList[0].colorRealValue;
	
	const newVal = dummyColorList[1].colorRealValue;
	const mockSetState = jest.fn();
	
	const { container } = render(<CategoryDetailsFormPartial 
		name="test"
		setName={dummySetState}
		color={startValue}
		setColor={mockSetState}
		desiredWeight={1}
		setDesiredWeight={dummySetState}
		colorList={dummyColorList} />);
	
	const colorInput = container.querySelector(".categoryColorInput");
	expect(colorInput.value).toEqual(startValue);
	
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
		color={dummyColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={weightText}
		setDesiredWeight={dummySetState}
		colorList={dummyColorList} />);
	
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
		color={dummyColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={mockCB}
		colorList={dummyColorList} />);
	
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
		color={dummyColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={mockCB}
		colorList={dummyColorList} />);
	
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
		color={dummyColorList[0].colorRealValue}
		setColor={dummySetState}
		desiredWeight={1}
		setDesiredWeight={mockCB}
		colorList={dummyColorList} />);
	
	const weightInput = container.querySelector(".categoryDesiredWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
	expect(mockCB).toHaveBeenCalledWith(expectedVal);
});