import ScalesNavList from './ScalesNavList';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

test.each([
	[[{ label: "test1", url: "/test1" }, { label: "test2", url: "/test2" }]],
	[[{ label: "test3", url: "/test3" }, { label: "test4", url: "/test4" }]]
])("ScalesNavList will render the given array of links with their labels", (scaleLinksList) => {
	
	render(<Router><ScalesNavList scaleLinks={scaleLinksList} /></Router>);
	
	//If one of these doesn't exist, the getByText will fail
	const linkElems = scaleLinksList.map((link) => screen.getByText(link.label));
	
});

test.each([
	[{ label: "test1", url: "/test1" }],
	[{ label: "test2", url: "/test2" }]
])("ScalesNavList will create Link elements with the correct url", (scaleLink) => {
	
	render(<Router><ScalesNavList scaleLinks={[scaleLink]} /></Router>);
	
	const linkElem = screen.getByText(scaleLink.label);
	
	expect(linkElem.href).toBe(`http://localhost${scaleLink.url}`);
	
});