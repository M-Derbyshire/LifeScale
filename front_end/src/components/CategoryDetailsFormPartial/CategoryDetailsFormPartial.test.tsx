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