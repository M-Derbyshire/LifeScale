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
	
	return (
		<div className="UserDetailsFormPartial">
			
			<label htmlFor={emailElemId}>Email: </label>
			<input id={emailElemId} type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
			
			
			
		</div>
	);
	
};

export default UserDetailsFormPartial;