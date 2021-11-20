import { render, fireEvent } from '@testing-library/react';
import ScaleDetailsFormPartial from './ScaleDetailsFormPartial';

const dummySetState = (x)=>{};

test.each([
	["test1"],
	["test2"]
])("ScaleDetailsFormPartial will set the name input value to the given name prop", (nameText) => {
	
	const { container } = render(<ScaleDetailsFormPartial 
		name={nameText} 
		setName={dummySetState} 
		usesTimespans={true}
		setUsesTimespans={dummySetState}
		dayCount={7}
		setDayCount={dummySetState} />);
	
	const nameInput = container.querySelector(".scaleNameInput");
	
	expect(nameInput).not.toBeNull();
	expect(nameInput.value).toEqual(nameText);
});

test("ScaleDetailsFormPartial will call the setName callback when changing the name field", () => {
	
	const newVal = "newVal";
	const mockSetState = jest.fn();
	
	const { container } = render(<ScaleDetailsFormPartial 
		name="test" 
		setName={mockSetState} 
		usesTimespans={true}
		setUsesTimespans={dummySetState}
		dayCount={7}
		setDayCount={dummySetState} />);
	
	const nameInput = container.querySelector(".scaleNameInput");
	
	fireEvent.change(nameInput, { target: { value: newVal } });
	
	expect(mockSetState).toHaveBeenCalledWith(newVal);
	
});




test.each([
	["1"],
	["2"]
])("ScaleDetailsFormPartial renders the dayCount prop as the dayCount", (countText) => {
	
	const { container } = render(<ScaleDetailsFormPartial 
		name="test" 
		setName={dummySetState} 
		usesTimespans={true}
		setUsesTimespans={dummySetState}
		dayCount={countText}
		setDayCount={dummySetState} />);
	
	const countInput = container.querySelector(".scaleDayCountInput");
	
	expect(countInput).not.toBeNull();
	expect(countInput.value).toEqual(countText);
	
});

test("ScaleDetailsFormPartial will use the dayCount prop as the dayCount onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = 2;
	
	const { container } = render(<ScaleDetailsFormPartial 
		name="test" 
		setName={dummySetState} 
		usesTimespans={true}
		setUsesTimespans={dummySetState}
		dayCount={1}
		setDayCount={mockCB} />);
	
	const countInput = container.querySelector(".scaleDayCountInput");
	
	fireEvent.change(countInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});

test("ScaleDetailsFormPartial will not allow dayCount to be a negative number (and will set the state to 0 instead)", () => {
	
	const mockCB = jest.fn();
	const newVal = -1;
	
	const { container } = render(<ScaleDetailsFormPartial 
		name="test" 
		setName={dummySetState} 
		usesTimespans={true}
		setUsesTimespans={dummySetState}
		dayCount={1}
		setDayCount={mockCB} />);
	
	const countInput = container.querySelector(".scaleDayCountInput");
	
	fireEvent.change(countInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(0);
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
});

test.each([
	[1.2, 1],
	[1.5, 2],
	[1.7, 2]
])("ScaleDetailsFormPartial will not allow dayCount to be a decimal number (will round the number instead)", (newVal, expectedVal) => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<ScaleDetailsFormPartial 
		name="test" 
		setName={dummySetState} 
		usesTimespans={true}
		setUsesTimespans={dummySetState}
		dayCount={1}
		setDayCount={mockCB} />);
	
	const countInput = container.querySelector(".scaleDayCountInput");
	
	fireEvent.change(countInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
	expect(mockCB).toHaveBeenCalledWith(expectedVal);
});