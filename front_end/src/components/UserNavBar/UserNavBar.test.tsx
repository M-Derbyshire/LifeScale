import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import UserNavBar from './UserNavBar';

const dummyLogoutCallback = ()=>{};

test("UserNavBar will render the given scale links", () => {
	
	const scaleLinks = [
		{ label: "test1", url: "/test1" },
		{ label: "test2", url: "/test2" },
		{ label: "test3", url: "/test3" },
	];
	
	render(<Router>
		<UserNavBar createScaleURL="" editUserURL="" scaleLinks={scaleLinks} logoutCallback={dummyLogoutCallback} />
	</Router>);
	
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
	
	render(<Router>
		<UserNavBar createScaleURL={route} editUserURL="" scaleLinks={[]} logoutCallback={dummyLogoutCallback} />
	</Router>);
	
	const createLink = screen.getByText(/create/i);
	
	expect(createLink).toHaveAttribute("href", route);
	
});

test.each([
	["/testEdit1"],
	["/testEdit2"]
])("UserNavBar will render a link to the edit user route", (route) => {
	
	render(<Router>
		<UserNavBar createScaleURL="" editUserURL={route} scaleLinks={[]} logoutCallback={dummyLogoutCallback} />
	</Router>);
	
	const editLink = screen.getByText(/edit/i);
	
	expect(editLink).toHaveAttribute("href", route);
	
});

test("UserNavBar will call the logoutCallback prop when the logout is clicked", () => {
	
	const mockLogoutCallback = jest.fn();
	
	render(<Router>
		<UserNavBar createScaleURL="" editUserURL="" scaleLinks={[]} logoutCallback={mockLogoutCallback} />
	</Router>);
	
	const logout = screen.getByText(/logout/i);
	fireEvent.click(logout);
	
	expect(mockLogoutCallback).toHaveBeenCalled();
});


test.each([
	["test1"],
	["test2"]
])("UserNavBar will render the a failedLogoutErrorMessage prop if one's passed in", (message) => {
	
	render(<Router>
		<UserNavBar 
			createScaleURL="" 
			editUserURL="" 
			scaleLinks={[]} 
			logoutCallback={dummyLogoutCallback} 
			failedLogoutErrorMessage={message} />
	</Router>);
	
	expect(screen.queryByText(message)).not.toBeNull();
	
});