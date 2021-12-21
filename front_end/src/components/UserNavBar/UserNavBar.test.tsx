import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import UserNavBar from './UserNavBar';


test("UserNavBar will render the given scale links", () => {
	
	const scaleLinks = [
		{ label: "test1", url: "/test1" },
		{ label: "test2", url: "/test2" },
		{ label: "test3", url: "/test3" },
	];
	
	render(<Router><UserNavBar createScaleURL="" editUserURL="" scaleLinks={scaleLinks} /></Router>);
	
	scaleLinks.forEach((sl) => {
		const link = screen.getByText(sl.label);
		expect(link).not.toBeNull();
		expect(link).toHaveAttribute("href", sl.url);
	});
	
});

// also renders a create link somewhere, with the right to

// renders the edit user link