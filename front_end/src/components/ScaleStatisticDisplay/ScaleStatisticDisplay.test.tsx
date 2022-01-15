import ScaleStatisticDisplay from './ScaleStatisticDisplay';
import { render, fireEvent } from '@testing-library/react';


const dummyCallback = ()=>{};

test("ScaleStatisticDisplay will display the given statistics, in the correct order", () => {
	
	const stats = [
		{ id:"test1", label: "test", percentage: 10, children: [
			{ label: "testChild1", percentage: 11, id: "testChild1" },
			{ label: "testChild2", percentage: 12, id: "testChild2" }
		]},
		{ id:"test2", label: "test", percentage: 10, children: [
			{ label: "testChild3", percentage: 11, id: "testChild3" },
			{ label: "testChild4", percentage: 12, id: "testChild4" }
		]}
	];
	
	
	const { container } = render(<ScaleStatisticDisplay 
									statistics={stats} 
									amendHistoryCallback={dummyCallback} />);
	
	
	
	//We want to make sure these are in the right order, but also nested correctly
	//Probably easiest to be explicit with the above structure
	
	const statElems = container.querySelectorAll(".PercentageStatistic");
	
	//First category
	expect(statElems[0].textContent).toEqual(
		expect.stringMatching(new RegExp(`${stats[0].label}.*${stats[0].percentage}`))
	);
	
	expect(statElems[1].textContent).toEqual(
		expect.stringMatching(new RegExp(`${stats[0].children[0].label}.*${stats[0].children[0].percentage}`))
	);
	
	expect(statElems[2].textContent).toEqual(
		expect.stringMatching(new RegExp(`${stats[0].children[1].label}.*${stats[0].children[1].percentage}`))
	);
	
	
	
	//Second category
	expect(statElems[3].textContent).toEqual(
		expect.stringMatching(new RegExp(`${stats[1].label}.*${stats[1].percentage}`))
	);
	
	expect(statElems[4].textContent).toEqual(
		expect.stringMatching(new RegExp(`${stats[1].children[0].label}.*${stats[1].children[0].percentage}`))
	);
	
	expect(statElems[5].textContent).toEqual(
		expect.stringMatching(new RegExp(`${stats[1].children[1].label}.*${stats[1].children[1].percentage}`))
	);
	
});