import TimespanFormPartial from './TimespanFormPartial';
import { render, fireEvent } from '@testing-library/react';

/*
	PLEASE NOTE:
	There is an issue at the moment with testing-library, in relation to time inputs.
	The value of time inputs will be "" if they haven't been changed. This is why 
	there are no tests here for the display.
*/


//Recreating here, rather than importing from module, as we want to knwo this stays the same
const getFormattedTimeStamp = (date:Date) => `${date.getHours()}:${date.getMinutes()}`;

const dummySetDate = (date)=>{};

test.each([
	["01:00"],
	["02:00"],
])("TimespanFormPartial will set the start date/time stamp when the input is changed", (timeStr) => {
	
	const newDate = "2021-01-01";
	const newDateTime = new Date(`${newDate} ${timeStr}`);
	
	const mockCB = jest.fn();
	
	const { container } = render(<TimespanFormPartial 
									startTime={new Date(newDate + " " + "00:00")}
									endTime={new Date()}
									setStartTime={mockCB}
									setEndTime={dummySetDate} />);
	
	const startInput = container.querySelector(".startTimeInput");
	
	fireEvent.change(startInput, { target: { value: timeStr } });
	
	expect(mockCB).toHaveBeenCalledWith(newDateTime);
	
});