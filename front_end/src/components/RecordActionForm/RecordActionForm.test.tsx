import RecordActionForm from './RecordActionForm';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const dummyEmpty = (x)=>{};
const dummySubmit = ()=>{};

const dummyTimespan = {
	id: "hasjkhdakjshd",
	date: new Date(),
	minuteCount: 2
};

const dummyCategories = [
	{
		id:"klasjdja", 
		name:"1", 
		color:"red", 
		desiredWeight:1, 
		actions:[
			{id:"lksd", name:"1", weight:1, timespans:[]},
			{id:"sAS", name:"2", weight:2, timespans:[]},
			{id:"werwer", name:"3", weight:3, timespans:[]}
		]
	},
	{
		id:"dskaskas", 
		name:"2", 
		color:"blue", 
		desiredWeight:2, 
		actions:[
			{id:"kjlj", name:"4", weight:1, timespans:[]},
			{id:"zcczc", name:"5", weight:2, timespans:[]},
			{id:"pioi", name:"6", weight:3, timespans:[]}
		]
	},
];

test("RecordActionForm will call the onSubmit prop when submitted", () => {
	
	const mockSubmit = jest.fn();
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={dummyCategories[0].id}
									setSelectedCategoryID={dummyEmpty}
									selectedActionID={dummyCategories[0].actions[0].id}
									setSelectedActionID={dummyEmpty}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={mockSubmit} />);
	
	const formElement = container.querySelector("form");
	fireEvent.submit(formElement);
	
	expect(mockSubmit).toHaveBeenCalled();
	
});





test("RecordActionForm will render the categories as options", () => {
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={dummyCategories[0].id}
									setSelectedCategoryID={dummyEmpty}
									selectedActionID={dummyCategories[0].actions[0].id}
									setSelectedActionID={dummyEmpty}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={dummySubmit} />);
	
	const categoryOptions = container.querySelectorAll(".categorySelect option");
	
	dummyCategories.forEach((cat, i) => {
		expect(categoryOptions[i].value).toBe(cat.id);
		expect(categoryOptions[i].textContent).toBe(cat.name);
	});
	
});

test.each(dummyCategories)("RecordActionForm will set the selected category to the given ID prop", (selectedCat) => {
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={selectedCat.id}
									setSelectedCategoryID={dummyEmpty}
									selectedActionID={dummyCategories[0].actions[0].id}
									setSelectedActionID={dummyEmpty}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={dummySubmit} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	
	expect(categorySelect.value).toBe(selectedCat.id);
	
});

test("RecordActionForm will call the setSelectedCategoryID prop when changing categories", () => {
	
	const selectedID = dummyCategories[0].id;
	const idToSelect = dummyCategories[1].id;
	
	const mockSetSelectedCategory = jest.fn();
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={selectedID}
									setSelectedCategoryID={mockSetSelectedCategory}
									selectedActionID={dummyCategories[0].actions[0].id}
									setSelectedActionID={dummyEmpty}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={dummySubmit} />);
	
	const categorySelect = container.querySelector(".categorySelect");
	userEvent.selectOptions(categorySelect, idToSelect);
	
	expect(mockSetSelectedCategory).toHaveBeenCalledWith(idToSelect);
	
});




test("RecordActionForm will render the actions as options", () => {
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={dummyCategories[0].id}
									setSelectedCategoryID={dummyEmpty}
									selectedActionID={dummyCategories[0].actions[0].id}
									setSelectedActionID={dummyEmpty}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={dummySubmit} />);
	
	const actionOptions = container.querySelectorAll(".actionSelect option");
	
	dummyCategories[0].actions.forEach((act, i) => {
		expect(actionOptions[i].value).toBe(act.id);
		expect(actionOptions[i].textContent).toBe(act.name);
	});
	
});

test.each(dummyCategories[0].actions)("RecordActionForm will set the selected action to the given ID prop", (selectedAct) => {
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={dummyCategories[0].id}
									setSelectedCategoryID={dummyEmpty}
									selectedActionID={selectedAct.id}
									setSelectedActionID={dummyEmpty}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={dummySubmit} />);
	
	const actionSelect = container.querySelector(".actionSelect");
	
	expect(actionSelect.value).toBe(selectedAct.id);
	
});

test("RecordActionForm will call the setSelectedActionID prop when changing actions", () => {
	
	const selectedID = dummyCategories[0].actions[0].id;
	const idToSelect = dummyCategories[0].actions[1].id;
	
	const mockSetSelectedAction = jest.fn();
	
	const { container } = render(<RecordActionForm 
									categories={dummyCategories}
									selectedCategoryID={dummyCategories[0].id}
									setSelectedCategoryID={dummyEmpty}
									selectedActionID={selectedID}
									setSelectedActionID={mockSetSelectedAction}
									timespan={dummyTimespan}
									setTimespan={dummyEmpty}
									onSubmit={dummySubmit} />);
	
	const actionSelect = container.querySelector(".actionSelect");
	userEvent.selectOptions(actionSelect, idToSelect);
	
	expect(mockSetSelectedAction).toHaveBeenCalledWith(idToSelect);
	
});