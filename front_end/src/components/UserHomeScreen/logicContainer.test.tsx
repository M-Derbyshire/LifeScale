import UserHomeScreenLogicContainer from './UserHomeScreenLogicContainer';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import { access } from 'fs';


const stdScaleLoadError = "Unable to load the selected scale.";

const dummyScale = {
	id: "testScale",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: []
}

const dummyScales = [ {...dummyScale, name: "scale1", id: "testScale1" }, {...dummyScale, name: "scale2", id: "testScale2" } ];

const dummyUser = {
    id: "testUser847274298734",
    email: "test@test.com",
	forename: "test",
	surname: "test",
	scales: dummyScales
};




// ------- Dummy data for testing statistics ------------------------------------------------------

//statisticDetails (total of 200)
// (we're purposefully not wanting to cause decimals here, so we don't fail due to decimal rounding decisons on the display side)
const dummyTestStatistics = [
    //categories
    {
        expectedPercentageTotal: 40,
        actions: [
            //Actions with arrays of timespan minutes
            { weight: 1, expectedPercentage: 30, actionTimespans: [5, 20, 5] },
            { weight: 2, expectedPercentage: 10, actionTimespans: [ 5 ] }
        ]
    },
    {
        expectedPercentageTotal: 60,
        actions: [
            { weight: 1, expectedPercentage: 30, actionTimespans: [ 10, 5, 5, 10 ] },
            { weight: 0.5, expectedPercentage: 30, actionTimespans: [ 20, 20, 20 ] }
        ]
    }
];

const dummyStatisticTestCategories = dummyTestStatistics.map((categoryStats, i) => ({
    id: "testCat" + i,
    name: "testCat" + i,
    color: "red",
    desiredWeight: 1,
    actions: categoryStats.actions.map((actionStat, i) => ({
        id: "testAct" + i,
        name: "testAct" + i,
        weight: actionStat.weight,
        timespans: actionStat.actionTimespans.map((minuteCount, i) => ({
            id: "testTS" + i,
            date: new Date(),
            minuteCount
        }))
    }))
}));

// ------------------------------------------------------------------------------------------------------



const dummyCallbackNoParam = () => {};
const dummyCallbackSingleParam = (x:any) => {};

const dummyUserService = new TestingDummyUserService();
dummyUserService.getLoadedUser = () => dummyUser;
dummyUserService.getScale = (scaleID:string) => dummyUser.scales.filter(scale => scale.id === scaleID)[0];

const defaultProps = {
    userService: dummyUserService,
    selectedScaleID: dummyUser.scales[0].id,
    scaleURLBase: "test",
    editUserURL: "/edit/user",
    createScaleURL: "/scales/create",
    onSuccessfulLogout: dummyCallbackNoParam,
    editScaleCallback: dummyCallbackSingleParam,
    amendHistoryCallback: dummyCallbackSingleParam,
};






test.each(dummyUser.scales.map(scale => [scale.id, scale.name]))
    ("UserHomeScreenLogicContainer will load the selected scale with the given ID, and pass it down to UserHomeScreen", (scaleID, scaleName) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} selectedScaleID={scaleID} /></Router>);
    
    const header = container.querySelector("header");
    
    expect(header.textContent).toEqual(expect.stringContaining(scaleName));
    
});

test("UserHomeScreenLogicContainer will pass down a scale loading error, if error loading user", () => {
    
    const errorMessage = "Unable to load user, test error";
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => { throw new Error(errorMessage) };
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} userService={mockUserService} /></Router>);
    
    expect(screen.getByText(errorMessage)).not.toBeNull();
    
});

test("UserHomeScreenLogicContainer will pass down a scale loading error, if error loading scale", () => {
    
    const errorMessage = stdScaleLoadError;
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getScale = (scaleID:string) => undefined; // the return type for not found
    
    const { container } = render(<Router><UserHomeScreenLogicContainer {...defaultProps} userService={mockUserService} /></Router>);
    
    expect(screen.getByText(errorMessage)).not.toBeNull();
    
});




test.each([
    ["/edit/test1"],
    ["/edit/test2"]
])("UserHomeScreenLogicContainer will pass the editUserUrl to UserHomeScreen", (editUrl) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } editUserURL={editUrl} /></Router>);
    
    const editUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${editUrl}"]`);
    
    expect(editUserLink).not.toBeNull();
    
});

test.each([
    ["/create/test1"],
    ["/create/test2"]
])("UserHomeScreenLogicContainer will pass the createScaleUrl to UserHomeScreen", (createUrl) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } createScaleURL={createUrl} /></Router>);
    
    const createUserLink = container.querySelector(`.UserNavBarLogicContainer a[href="${createUrl}"]`);
    
    expect(createUserLink).not.toBeNull();
    
});

test.each([
    ["test1"],
    ["test2"]
])("UserHomeScreenLogicContainer will pass scaleURLBase prop to UserHomeScreen", (baseUrl) => {
    
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } scaleURLBase={baseUrl} /></Router>);
    
    
    dummyUser.scales.forEach(scale => {
        
        const link = screen.getByRole("link", { name: scale.name });
        
        const hrefRegex = new RegExp(`.*${baseUrl}.*${scale.id}.*`);
        expect(link).toHaveAttribute("href", expect.stringMatching(hrefRegex));
        
    });
    
});





test("UserHomeScreenLogicContainer will calculate the statistics percentages for categories and actions, and pass them to UserHomeScreen", () => {
    
    const mockScale = {
        ...dummyUser.scales[0],
        categories: dummyStatisticTestCategories
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    //Now we need to create a list of the expected percentages (category and statistic), in expected display order
    const expectedPercentages = dummyTestStatistics.reduce((categoryAcc, categoryStat) => {
        
        return [
            ...categoryAcc, 
            categoryStat.expectedPercentageTotal, 
            ...categoryStat.actions.reduce((actionAcc, actionStat) => {
                
                return [
                    ...actionAcc,
                    actionStat.expectedPercentage
                ];
                
            }, new Array<number>())
        ];
        
    }, new Array<number>());
    
    
    
    //Now we can actually setup the test
    const { container } = render(<Router><UserHomeScreenLogicContainer { ...defaultProps } userService={mockUserService} /></Router>);
    
    const statisticDisplay = container.querySelector(".ScaleStatisticDisplay");
    const percentageDisplays = within(statisticDisplay).queryAllByText(/\%/);
    
    
    expect(percentageDisplays.length).toBe(expectedPercentages.length);
    expectedPercentages.forEach((expectedPercentage, i) => expect(percentageDisplays[i].textContent).toEqual(`${expectedPercentage}%`));
    
});

// UserHomeScreenLogicContainer will map the category percentages to currentBalanceItems, and pass them to UserHomeScreen

// UserHomeScreenLogicContainer will map the desired weights of categories to desiredBalanceItems, and pass them to UserHomeScreen



// UserHomeScreenLogicContainer will refresh the percentage statistics after recording a new timespan

// UserHomeScreenLogicContainer will refresh the currentBalanceItems after recording a new timespan



// UserHomeScreenLogicContainer will pass onSuccessfulLogout to UserHomeScreen

// UserHomeScreenLogicContainer will pass editScaleCallback to UserHomeScreen, and feed in the scale ID when calling it

// UserHomeScreenLogicContainer will pass amendHistoryCallback to UserHomeScreen, and feed in the scale ID when calling it