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