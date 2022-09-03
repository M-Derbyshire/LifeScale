
//Converts a date object to a string that can be passed to a DatePicker component (3rd part component)
function convertDateToInputString(date:Date):string
{
	const day = date.getDate();
	const month = date.getMonth() + 1;
	
	const paddedDay = (day < 10) ? `0${day}` : day;
	const paddedMonth = (month < 10) ? `0${month}` : month;
	
	return `${date.getFullYear()}-${paddedMonth}-${paddedDay}`;
}

export default convertDateToInputString;