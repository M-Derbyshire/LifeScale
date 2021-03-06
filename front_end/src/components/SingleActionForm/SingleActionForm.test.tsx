import SingleActionForm from './SingleActionForm';
import { render, fireEvent, screen } from '@testing-library/react';

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





test.each([
	["1"],
	["2"]
])("SingleActionForm renders the weight prop as the weight", (weightText) => {
	
	const { container } = render(<SingleActionForm name="test" setName={dummySetState} weight={weightText} setWeight={dummySetState} onSubmit={dummySubmitCB} />);
	
	const weightInput = container.querySelector(".singleActionWeightInput");
	
	expect(weightInput).not.toBeNull();
	expect(weightInput.value).toEqual(weightText);
	
});

test("SingleActionForm will use the setWeight prop as the weight onChange event", () => {
	
	const mockCB = jest.fn();
	const newVal = 2;
	
	const { container } = render(<SingleActionForm name="test" setName={dummySetState} weight="1" setWeight={mockCB} onSubmit={dummySubmitCB} />);
	
	const weightInput = container.querySelector(".singleActionWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(newVal);
});

test("SingleActionForm will not allow weight to be a negative number (and will set the state to 0 instead)", () => {
	
	const mockCB = jest.fn();
	const newVal = -1;
	
	const { container } = render(<SingleActionForm name="test" setName={dummySetState} weight="1" setWeight={mockCB} onSubmit={dummySubmitCB} />);
	
	const weightInput = container.querySelector(".singleActionWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(0);
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
});

test.each([
	[1.2, 1],
	[1.5, 2],
	[1.7, 2]
])("SingleActionForm will not allow weight to be a decimal number (will round the number instead)", (newVal, expectedVal) => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<SingleActionForm name="test" setName={dummySetState} weight="1" setWeight={mockCB} onSubmit={dummySubmitCB} />);
	
	const weightInput = container.querySelector(".singleActionWeightInput");
	
	fireEvent.change(weightInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
	expect(mockCB).toHaveBeenCalledWith(expectedVal);
});




test("SingleActionForm will call the onSubmit handler prop when submitted", () => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<SingleActionForm name="test" setName={dummySetState} weight="1" setWeight={dummySetState} onSubmit={mockCB} />);
	
	//Checking this to make sure it's there, as fireEvent.submit() should actually be used (virtual dom doesn't implement submit)
	const submit = container.querySelector("form input[type=submit]");
	expect(submit).not.toBeNull();
	
	const form = container.querySelector("form");
	fireEvent.submit(form);
	
	expect(mockCB).toHaveBeenCalled();
	
});



test("SingleActionForm will not render a delete button if no onDelete prop given", () => {
	
	render(<SingleActionForm name="test" setName={dummySetState} weight="1" setWeight={dummySetState} onSubmit={dummySubmitCB} />);
	
	const deleteButton = screen.queryByRole("button", { name: /delete/i });
	
	expect(deleteButton).toBeNull();
	
});

test("SingleActionForm will render a delete button if onDelete prop given", () => {
	
	render(<SingleActionForm 
		name="test" 
		setName={dummySetState} 
		weight="1" 
		setWeight={dummySetState} 
		onSubmit={dummySubmitCB} 
		onDelete={dummySubmitCB} />);
	
	const deleteButton = screen.queryByRole("button", { name: /delete/i });
	
	expect(deleteButton).not.toBeNull();
	
});

test("SingleActionForm delete button will call onDelete prop", () => {
	
	const mockDelete = jest.fn();
	
	render(<SingleActionForm 
		name="test" 
		setName={dummySetState} 
		weight="1" 
		setWeight={dummySetState} 
		onSubmit={dummySubmitCB} 
		onDelete={mockDelete} />);
	
	const deleteButton = screen.queryByRole("button", { name: /delete/i });
	
	fireEvent.click(deleteButton);
	
	expect(mockDelete).toHaveBeenCalled();
	
});


test.each([
	["test1"],
	["test2"]
])("SingleActionForm will render the badSaveErrorMessage prop in a BadSaveMessage", (message) => {
	
	const { container } = render(<SingleActionForm 
				name="test" 
				setName={dummySetState} 
				weight="1" 
				setWeight={dummySetState} 
				onSubmit={dummySubmitCB}
				badSaveErrorMessage={message} />);
	
	const messageDisplay = container.querySelector(".BadSaveMessage")
	
	expect(messageDisplay).not.toBeNull();
	expect(messageDisplay.textContent).toEqual(expect.stringContaining(message));
	
});


test.each([
	["test1"],
	["test2"]
])("SingleActionForm will render the goodSaveMessage prop in a GoodSaveMessage", (message) => {
	
	const { container } = render(<SingleActionForm 
				name="test" 
				setName={dummySetState} 
				weight="1" 
				setWeight={dummySetState} 
				onSubmit={dummySubmitCB}
				goodSaveMessage={message} />);
	
	const messageDisplay = container.querySelector(".GoodSaveMessage")
	
	expect(messageDisplay).not.toBeNull();
	expect(messageDisplay.textContent).toEqual(expect.stringContaining(message));
	
});