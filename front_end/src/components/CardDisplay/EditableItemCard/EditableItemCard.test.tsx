import EditableItemCard from './EditableItemCard';
import { render, fireEvent, screen } from '@testing-library/react';

const dummyEditCallback = ()=>{};

test.each([
	["test1"],
	["test2"]
])("EditableItemCard will display the given name prop", (nameText) => {
	
	render(<EditableItemCard name={nameText} editCallback={dummyEditCallback} />);
	
	const nameDisplay = screen.getByText(nameText);
	
	expect(nameDisplay).not.toBeNull();
	
});


test("EditableItemCard will call the given edit callback prop when the edit button is clicked", () => {
	
	const mockCB = jest.fn();
	const { container } = render(<EditableItemCard name="test" editCallback={mockCB} />);
	
	const editButton = container.querySelector("button");
	
	fireEvent.click(editButton);
	
	expect(mockCB).toHaveBeenCalled();
	
});