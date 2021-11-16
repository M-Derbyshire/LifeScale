import React, { FC } from 'react';

interface IUserDetailsFormPartialProps {
	email:string;
	setEmail:(email:string)=>void;
	forename:string;
	setForename:(name:string)=>void;
	surname:string;
	setSurname:(name:string)=>void;
}

/*
	Used to display and set basic user account details (not including password set/reset)
*/
const UserDetailsFormPartial:FC<IUserDetailsFormPartialProps> = (props) => {
	
	const emailElemId = "userDetailEmailInput";
	const forenameElemId = "userDetailForenameInput";
	const surnameElemId = "userDetailSurnameInput";
	
	return (
		<div className="UserDetailsFormPartial">
			
			<label htmlFor={emailElemId}>Email: </label>
			<input id={emailElemId} type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
			<br/>
			
			<label htmlFor={forenameElemId}>Forename: </label>
			<input className="userForenameInput" id={forenameElemId} type="text" value={props.forename} onChange={(e)=>props.setForename(e.target.value)} />
			<br/>
			
			<label htmlFor={surnameElemId}>Surname: </label>
			<input className="userSurnameInput" id={surnameElemId} type="text" value={props.surname} onChange={(e)=>props.setSurname(e.target.value)} />
			
		</div>
	);
	
};

export default UserDetailsFormPartial;