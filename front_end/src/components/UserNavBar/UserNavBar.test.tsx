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

test.each([
	["/testCreate1"],
	["/testCreate2"]
])("UserNavBar will render a link to the create scale route", (route) => {
	
	render(<Router><UserNavBar createScaleURL={route} editUserURL="" scaleLinks={[]} /></Router>);
	
	const createLink = screen.getByText(/create/i);
	
	expect(createLink).toHaveAttribute("href", route);
	
});

// renders the edit user link