import EditableItemCard from './EditableItemCard';
import { render, fireEvent, screen } from '@testing-library/react';

const dummyEditCallback = ()=>{};

test.each([
	["test1"],
	["test2"]
])("EditableItemCard will display the given name prop", (nameText) => {
	
	render(<EditableItemCard name={nameText} />);
	
	const nameDisplay = screen.getByText(nameText);
	
	expect(nameDisplay).not.toBeNull();
	
});