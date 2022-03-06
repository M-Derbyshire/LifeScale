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
	
	return (
		<div className="UserDetailsFormPartial">
			
			<label>
				Email: <input type="email" required value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
			</label>
			<br/>
			
			<label>
				Forename: <input className="userForenameInput" required type="text" value={props.forename} onChange={(e)=>props.setForename(e.target.value)} />
			</label>
			<br/>
			
			<label>
				Surname: <input className="userSurnameInput" required type="text" value={props.surname} onChange={(e)=>props.setSurname(e.target.value)} />
			</label>
			
		</div>
	);
	
};

export default UserDetailsFormPartial;