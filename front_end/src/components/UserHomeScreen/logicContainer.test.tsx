import UserHomeScreenLogicContainer from './UserHomeScreenLogicContainer';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';
import { access } from 'fs';


const stdScaleLoadError = "Unable to load the selected scale.";

const dummyCategory1 = {
	id: "testCat23132948284",
	name: "testcat1",
	color: "",
	desiredWeight: 1,
	actions: [
        {
            id: "testAct2348743749874",
            name: "testAct1",
            weight: 1,
            timespans: []
        }
    ]
};

const dummyCategory2 = {
	id: "testCatd3482384092348",
	name: "testcat2",
	color: "",
	desiredWeight: 1,
	actions: [
        {
            id: "testAct897432897497",
            name: "testAct2",
            weight: 1,
            timespans: []
        }
    ]
};

const dummyCategory3 = {
	id: "testCat32482934809438",
	name: "testcat3",
	color: "",
	desiredWeight: 1,
	actions: [
        {
            id: "testAct28438290842038",
            name: "testAct3",
            weight: 1,
            timespans: []
        }
    ]
}

const dummyScale = {
	id: "testScale",
	name: "testscale",
	usesTimespans: true,
	displayDayCount: 7,
	categories: [dummyCategory1, dummyCategory2, dummyCategory3]
}

const dummyScales = [ {...dummyScale, name: "scale1", id: "testScale1" }, {...dummyScale, name: "scale2", id: "testScale2" } ];

const dummyUser = {
    id: "testUser847274298734",
    email: "test@test.com",
	forename: "test",
	surname: "test",
	scales: dummyScales
};



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
    
    // We want to create some timespan details (minute counts, weights, and the expected percentages)
    
    //statisticDetails (total of 200)
    // (we're purposefully not wanting to cause decimals here, so we don't fail due to decimal rounding decisons on the display side)
    const scaleStatistics = [
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
    
    
    // Now setup the mockUserService, to return the above, mapped into proper category/action/timespan objects
    const mockScale = {
        ...dummyUser.scales[0],
        categories: scaleStatistics.map((categoryStats, i) => ({
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
        }))
    };
    
    const mockUserService = { ...dummyUserService };
    mockUserService.getLoadedUser = () => ({ ...dummyUser, scales: [mockScale] });
    mockUserService.getScale = (id:string) => mockScale;
    
    //Now we need to create a list of the expected percentages (category and statistic), in expected display order
    const expectedPercentages = scaleStatistics.reduce((categoryAcc, categoryStat) => {
        
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

// UserHomeScreenLogicContainer will calculate the desiredBalanceItems, and pass them to UserHomeScreen

// UserHomeScreenLogicContainer will calculate the currentBalanceItems, and pass them to UserHomeScreen



// UserHomeScreenLogicContainer will refresh the percentage statistics after recording a new timespan

// UserHomeScreenLogicContainer will refresh the currentBalanceItems after recording a new timespan



// UserHomeScreenLogicContainer will pass onSuccessfulLogout to UserHomeScreen

// UserHomeScreenLogicContainer will pass editScaleCallback to UserHomeScreen, and feed in the scale ID when calling it

// UserHomeScreenLogicContainer will pass amendHistoryCallback to UserHomeScreen, and feed in the scale ID when calling it