import React { FC } from 'react';
import './RequestPasswordPage.scss';

interface IRequestPasswordPageProps {
	email:string;
	setEmail:(email:string)=>void;
	onSubmit:()=>void;
	badSaveErrorMessage?:string;
	goodSaveMessage?:string;
}


const RequestPasswordPage:FC<IRequestPasswordPageProps> = (props) => {
	
	return (
		<div className="RequestPasswordPage">
			
		</div>
	);
	
};

export default RequestPasswordPage;