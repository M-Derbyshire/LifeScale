import React, { FC } from 'react';
import './LoginForm.scss';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

interface ILoginFormProps {
	email:string;
	setEmail:(email:string)=>void;
	password:string;
	setPassword:(password:string)=>void;
	onSubmit:()=>void;
	badSaveErrorMessage?:string;
}

/*
	Display layer component to display a form for users to request a new password
*/
const LoginForm:FC<ILoginFormProps> = (props) => {
	
	return (
		<div className="LoginForm">
			<form onSubmit={props.onSubmit}>
				
				<label>
					Email: <input type="email" value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				</label>
				<br/>
				
				<label>
					Password: <input type="password" value={props.password} onChange={(e)=>props.setPassword(e.target.value)} />
				</label>
				
				<br />
				
				{props.badSaveErrorMessage && 
							<BadSaveMessage message={props.badSaveErrorMessage} />}
				
				<input type="submit" value="Login" />
			</form>
		</div>
	);
	
};

export default LoginForm;