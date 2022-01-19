import NavigatableContentWrapper from './NavigatableContentWrapper';
import { render } from '@testing-library/react';

const dummyNavBar = (<div className="dummyNavBar">dummy nav bar</div>);

const smallScreenClass = "smallScreenWidth";

test.each([
	["testChild1", "testChild2"],
	["testChild3", "testChild4"]
])("NavigatableContentWrapper will render the given children", (childrenClasses) => {
	
	const { container } = render(<NavigatableContentWrapper navigationBar={dummyNavBar} smallScreenWidthPixels={50} >
		<div className={childrenClasses[0]}>test</div>
		<div className={childrenClasses[1]}>test</div>
	</NavigatableContentWrapper>);
	
	expect(container.querySelector(`.${childrenClasses[0]}`)).not.toBeNull();
	expect(container.querySelector(`.${childrenClasses[1]}`)).not.toBeNull();
	
});

test.each([
	["testNav1"],
	["testVav2"]
])("NavigatableContentWrapper will render the given children", (navClass) => {
	
	const mockNavBar = (<div className={navClass}>Test</div>);
	
	const { container } = render(<NavigatableContentWrapper navigationBar={mockNavBar} smallScreenWidthPixels={50} >
	</NavigatableContentWrapper>);
	
	expect(container.querySelector(`.${navClass}`)).not.toBeNull();
	
});





test("NavigatableContentWrapper will add small screen class to wrapperContentContainer, when screen is smaller than the given width in px", () => {
	
	//IMPORTANT - This tests is based on the fact that JSDOM renders the screen width as 1024
	
	const { container } = render(<NavigatableContentWrapper navigationBar={dummyNavBar} smallScreenWidthPixels={2048} >
	</NavigatableContentWrapper>);
	
	const containingElem = container.querySelector(".wrapperContentContainer");
	
	expect(containingElem.classList.contains(smallScreenClass)).toBeTruthy();
	
	
});

test("NavigatableContentWrapper will add small screen class to wrapperContentContainer, when screen is equal to the given width in px", () => {
	
	//IMPORTANT - This tests is based on the fact that JSDOM renders the screen width as 1024
	
	const { container } = render(<NavigatableContentWrapper navigationBar={dummyNavBar} smallScreenWidthPixels={1024} >
	</NavigatableContentWrapper>);
	
	const containingElem = container.querySelector(".wrapperContentContainer");
	
	expect(containingElem.classList.contains(smallScreenClass)).toBeTruthy();
	
	
});

test("NavigatableContentWrapper will not add small screen class to wrapperContentContainer, when screen is larger than the given width in px", () => {
	
	//IMPORTANT - This tests is based on the fact that JSDOM renders the screen width as 1024
	
	const { container } = render(<NavigatableContentWrapper navigationBar={dummyNavBar} smallScreenWidthPixels={1000} >
	</NavigatableContentWrapper>);
	
	const containingElem = container.querySelector(".wrapperContentContainer");
	
	expect(containingElem.classList.contains(smallScreenClass)).toBeFalsy();
	
	
});



test("NavigatableContentWrapper will not render the navigation in a DropdownContentBar, if the screen is wider than the given small screen value", () => {
	
	//IMPORTANT - This tests is based on the fact that JSDOM renders the screen width as 1024
	
	const mockNavBar = (<div className={"navigationTest"}>Test</div>);
	
	const { container } = render(<NavigatableContentWrapper navigationBar={mockNavBar} smallScreenWidthPixels={1000} >
	</NavigatableContentWrapper>);
	
	expect(container.querySelector(".DropdownContentBar")).toBeNull();
	expect(container.querySelector(".navigationTest")).not.toBeNull();
	
});

test("NavigatableContentWrapper will render the navigation in a DropdownContentBar, if the screen is not wider than the given small screen value", () => {
	
	//IMPORTANT - This tests is based on the fact that JSDOM renders the screen width as 1024
	
	const mockNavBar = (<div className={"navigationTest"}>Test</div>);
	
	const { container } = render(<NavigatableContentWrapper navigationBar={mockNavBar} smallScreenWidthPixels={2048} >
	</NavigatableContentWrapper>);
	
	expect(container.querySelector(".DropdownContentBar .navigationTest")).not.toBeNull();
	
});