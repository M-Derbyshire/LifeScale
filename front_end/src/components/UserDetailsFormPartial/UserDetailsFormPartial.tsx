import React, { FC } from 'react';

interface IUserDetailsFormPartialProps {
	email:string;
	setEmail:(email:string)=>void;
	forename:string;
	setForename:(name:string)=>void;
	surname:string;
	setSurname:(name:string)=>void;
}

const UserDetailsFormPartial:FC<IUserDetailsFormPartialProps> = (props) => {
	
	const emailElemId = "userDetailEmailInput";
	const forenameElemId = "userDetailForenameInput"
	
	return (
		<div className="UserDetailsFormPartial">
			
			<label htmlFor={emailElemId}>Email: </label>
			<input id={emailElemId} type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
			<br/>
			
			<label htmlFor={forenameElemId}>Forename: </label>
			<input className="userForenameInput" id={forenameElemId} type="text" value={props.forename} onChange={(e)=>props.setForename(e.target.value)} />
			<br/>
			
		</div>
	);
	
};

export default UserDetailsFormPartial;