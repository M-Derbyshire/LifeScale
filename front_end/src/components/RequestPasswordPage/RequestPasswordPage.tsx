import React, { FC } from 'react';
import './RequestPasswordPage.scss';
import RequestPasswordForm from '../RequestPasswordForm/RequestPasswordForm';

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
			<div className="RequestPasswordPageContainer">
				<RequestPasswordForm
					email={props.email}
					setEmail={props.setEmail}
					onSubmit={props.onSubmit}
					badSaveErrorMessage={props.badSaveErrorMessage}
					goodSaveMessage={props.goodSaveMessage} />
			</div>
		</div>
	);
	
};

export default RequestPasswordPage;