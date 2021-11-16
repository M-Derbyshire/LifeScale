import SingleActionForm from './SingleActionForm';
import { render, fireEvent } from '@testing-library/react';

const dummySetState = (x)=>{};
const dummySubmitCB = ()=>{};

test.each([
	["name1"],
	["name2"]
])("SingleActionForm renders the name prop as the name", (nameText) => {
	
	const { container } = render(<SingleActionForm name={nameText} setName={dummySetState} weight="1" setWeight={dummySetState} onSubmit={dummySubmitCB} />);
	
	const nameInput = container.querySelector(".singleActionNameInput");
	
	expect(nameInput).not.toBeNull();
	expect(nameInput.value).toEqual(nameText);
	
});

test("SingleActionForm will use the setName prop as the name onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = "newVal";
	
	const { container } = render(<SingleActionForm name="test" setName={mockCB} weight="1" setWeight={dummySetState} onSubmit={dummySubmitCB} />);
	
	const nameInput = container.querySelector(".singleActionNameInput");
	
	fireEvent.change(nameInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});