import NavigatableContentWrapper from './NavigatableContentWrapper';
import { render } from '@testing-library/react';

const dummyNavBar = (<div className="dummyNavBar">dummy nav bar</div>);

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