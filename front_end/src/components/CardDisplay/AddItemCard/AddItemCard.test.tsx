import AddItemCard from './AddItemCard';
import { render, fireEvent } from '@testing-library/react';

test("AddItemCard will call onClick prop when clicked", () => {
	
	const mockCB = jest.fn();
	const { container } = render(<AddItemCard onClick={mockCB} />);
	
	const card = container.querySelector(".AddItemCard");
	
	fireEvent.click(card);
	
	expect(mockCB).toHaveBeenCalled();
});