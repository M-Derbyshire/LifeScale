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
	
	
	return (
		<div className="UserDetailsFormPartial">
			
		</div>
	);
	
};

export default UserDetailsFormPartial;