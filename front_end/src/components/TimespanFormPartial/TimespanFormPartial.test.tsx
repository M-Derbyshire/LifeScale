import TimespanFormPartial from './TimespanFormPartial';
import { render, fireEvent } from '@testing-library/react';

const emptySetState = (x)=>{};

test.each([
	[120],
	[240],
	[350],
	[90]
])("TimespanFormPartial will display the given minute count", (mins) => {
	
	const { container } = render(<TimespanFormPartial 
									minutes={mins} 
									setMinutes={emptySetState} 
									minuteDisplayValue={mins.toString()}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue=""
									setHourDisplayValue={emptySetState} />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	expect(minuteInput.value).toEqual(mins.toString());
	
});

test.each([
	[120],
	[240],
	[350],
	[90]
])("TimespanFormPartial will call the setMinutes prop with the minute value, when setting the minute input", (newMins) => {
	
	const mockSetState = jest.fn();
	
	const { container } = render(<TimespanFormPartial 
									minutes={0} 
									setMinutes={mockSetState}
									minuteDisplayValue={"0"}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue=""
									setHourDisplayValue={emptySetState}  />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	fireEvent.change(minuteInput, { target: { value: newMins } });
	
	expect(mockSetState).toHaveBeenCalledWith(newMins);
	
});

test("TimespanFormPartial will not allow minutes to be a negative number (and will set the state to 0 instead)", () => {
	
	const mockCB = jest.fn();
	const newVal = -1;
	
	const { container } = render(<TimespanFormPartial 
									minutes={1} 
									setMinutes={mockCB}
									minuteDisplayValue={"1"}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue=""
									setHourDisplayValue={emptySetState}  />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	fireEvent.change(minuteInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
});


test.each([
	[120],
	[240],
	[350],
	[90]
])("TimespanFormPartial will display the minute count", (minutes) => {
	
	const { container } = render(<TimespanFormPartial 
									minutes={minutes} 
									setMinutes={emptySetState}
									minuteDisplayValue={minutes.toString()}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue={""}
									setHourDisplayValue={emptySetState}  />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	expect(minuteInput.value).toEqual(minutes.toString());
	
});

test.each([
	[120],
	[240],
	[350],
	[90]
])("TimespanFormPartial will display the hour count", (hours) => {
	
	const { container } = render(<TimespanFormPartial 
									minutes={1} 
									setMinutes={emptySetState}
									minuteDisplayValue={"1"}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue={hours.toFixed(2)}
									setHourDisplayValue={emptySetState}  />);
	
	const hourInput = container.querySelector(".timespanHourInput");
	
	expect(hourInput.value).toEqual(hours.toFixed(2));
	
});

test.each([
	[120],
	[240],
	[350],
	[90]
])("TimespanFormPartial will call the setMinutes prop with the hour value, multiplied by 60, when setting the hour input", (newHours) => {
	
	const mockSetState = jest.fn();
	
	const { container } = render(<TimespanFormPartial 
									minutes={0} 
									setMinutes={mockSetState}
									minuteDisplayValue={"0"}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue={""}
									setHourDisplayValue={emptySetState} />);
	
	const hourInput = container.querySelector(".timespanHourInput");
	
	fireEvent.change(hourInput, { target: { value: newHours } });
	
	expect(mockSetState).toHaveBeenCalledWith(newHours * 60);
	
});

test("TimespanFormPartial will not allow hours to be a negative number (and will set the state to 0 instead)", () => {
	
	const mockCB = jest.fn();
	const newVal = -1;
	
	const { container } = render(<TimespanFormPartial 
									minutes={1} 
									setMinutes={mockCB}
									minuteDisplayValue={"0"}
									setMinuteDisplayValue={emptySetState}
									hourDisplayValue={""}
									setHourDisplayValue={emptySetState} />);
	
	const hourInput = container.querySelector(".timespanHourInput");
	
	fireEvent.change(hourInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
});