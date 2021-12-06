import TimespanFormPartial from './TimespanFormPartial';
import { render, fireEvent } from '@testing-library/react';

const emptySetState = (x)=>{};

test.each([
	[120],
	[240],
	[350],
	[90]
])("TimespanFormPartial will display the given minute count", (mins) => {
	
	const { container } = render(<TimespanFormPartial minutes={mins} setMinutes={emptySetState} />);
	
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
	
	const { container } = render(<TimespanFormPartial minutes={0} setMinutes={mockSetState} />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	fireEvent.change(minuteInput, { target: { value: newMins } });
	
	expect(mockSetState).toHaveBeenCalledWith(newMins);
	
});

test("TimespanFormPartial will not allow minutes to be a negative number (and will set the state to 0 instead)", () => {
	
	const mockCB = jest.fn();
	const newVal = -1;
	
	const { container } = render(<TimespanFormPartial minutes={1} setMinutes={mockCB} />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	fireEvent.change(minuteInput, { target: { value: newVal } });
	
	expect(mockCB).toHaveBeenCalledWith(0);
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
});

test.each([
	[1.2, 1],
	[1.5, 2],
	[1.7, 2]
])("TimespanFormPartial will not allow minutes to be a decimal number (will round the number instead)", (newVal, expectedVal) => {
	
	const mockCB = jest.fn();
	
	const { container } = render(<TimespanFormPartial minutes={1} setMinutes={mockCB} />);
	
	const minuteInput = container.querySelector(".timespanMinuteInput");
	
	fireEvent.change(minuteInput, { target: { value: newVal } });
	
	expect(mockCB).not.toHaveBeenCalledWith(newVal);
	expect(mockCB).toHaveBeenCalledWith(expectedVal);
});