import React, { FC } from 'react';
import './LoginForm.scss';
import BadSaveMessage from '../SaveMessage/BadSaveMessage';

interface ILoginFormProps {
	email:string;
	setEmail:(email:string)=>void;
	password:string;
	setPassword:(password:string)=>void;
	onSubmit:()=>void;
	badLoginErrorMessage?:string;
}

/*
	Display-layer component to display a form for users to log in
*/
const LoginForm:FC<ILoginFormProps> = (props) => {
	
	return (
		<div className="LoginForm">
			<form onSubmit={(e) => { e.preventDefault(); props.onSubmit(); }}>
				
				<label>
					Email: <input type="email" required value={props.email} onChange={(e)=>props.setEmail(e.target.value)} />
				</label>
				<br/>
				
				<label>
					Password: <input type="password" required value={props.password} onChange={(e)=>props.setPassword(e.target.value)} />
				</label>
				
				<br />
				
				{props.badLoginErrorMessage && 
							<BadSaveMessage message={props.badLoginErrorMessage} />}
				
				<input type="submit" value="Login" />
			</form>
		</div>
	);
	
};

export default LoginForm;