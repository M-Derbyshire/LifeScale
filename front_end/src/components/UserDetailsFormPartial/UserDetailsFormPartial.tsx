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
	Used to display and set basic user account details (not including password set/reset).
	See UserDetailsForm and UserDetailsFormLogicContainer components for more details on usage/logic
*/
const UserDetailsFormPartial:FC<IUserDetailsFormPartialProps> = (props) => {
	
	return (
		<div className="UserDetailsFormPartial">
			
			<label>
				Email: <input 
							type="email" 
							data-test="userDetailsEmail" 
							required 
							value={props.email} 
							onChange={(e)=>props.setEmail(e.target.value)} />
			</label>
			<br/>
			
			<label>
				Forename: <input 
								className="userForenameInput" 
								data-test="userDetailsForename" 
								required 
								type="text" 
								value={props.forename} 
								onChange={(e)=>props.setForename(e.target.value)} />
			</label>
			<br/>
			
			<label>
				Surname: <input 
								className="userSurnameInput" 
								data-test="userDetailsSurname" 
								required 
								type="text" 
								value={props.surname} 
								onChange={(e)=>props.setSurname(e.target.value)} />
			</label>
			
		</div>
	);
	
};

export default UserDetailsFormPartial;