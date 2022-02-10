import CategoryDetailsFormLogicContainer from './CategoryDetailsFormLogicContainer';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingDummyUserService from '../../userServices/TestingDummyUserService/TestingDummyUserService';


const dummyBackHandler = ()=>{};

const dummyScaleID = "testScaleID";

const dummyCategory = {
	id: "testCat23132948284",
	name: "testcat",
	color: "red",
	desiredWeight: 1,
	actions: [{
		id: "testact3298294848",
		name: "testAct",
		weight: 1,
		timespans: []
	}]
}

const dummyUserService = new TestingDummyUserService();
dummyUserService.getCategory = (catID, scaleID) => dummyCategory;

// displays form
test("CategoryDetailsFormLogicContainer will display a CategoryDetailsForm", () => {
	
	const { container } = render(<CategoryDetailsFormLogicContainer
									scaleID={dummyScaleID}
									categoryID={dummyCategory.id}
									backButtonHandler={dummyBackHandler}
									userService={dummyUserService} />);
	
	expect(container.querySelector(".CategoryDetailsForm")).not.toBeNull();
	
});

//displays action form if category id (think about header text as well)

// doesn't display action form if no category id

// displays delete button if category id

// doesn't display delete if no cat id

// loads scale on create

// loads scale and category on edit

// badLoadErrorMessage on bad scale load

//badLoadErrorMessage on bad category load

// badLoadErrorMessage to category form on bad load callback from actionform

// handles form state

// back button handler

// save creating

// save updating

// error message on bad create

// error message on bad update

// save message on good create

// save message on good update

// disable submit while creating, re-enable when done

// disable submit while updating, re-enable when done

// re-enable submit after bad create

// re-enable submit after bad update

// calls delete on user service, on delete button

// displays bad save message on bad delete

// call onSuccessfulDeleteHandler after good delete