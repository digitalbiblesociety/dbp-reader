/**
*
* AccountSettings
*
*/

import React from 'react';
// TODO: Get svg for password lock icon

import { FormattedMessage } from 'react-intl';
import ImageComponent from 'components/ImageComponent';
import messages from './messages';
import SvgWrapper from '../SvgWrapper/index';

function AccountSettings() {
	return (
		<div className="account-settings">
			<div role="button" tabIndex={0} className="logout-button"><FormattedMessage {...messages.logout} /></div>
			<section className="personal-info">
				<ImageComponent classes="profile-picture" alt="Profile Picture" src="https://s3.amazonaws.com/resources-live.sketch.cloud/files/fe8cf8bd-87d5-4e2c-a2b7-7db3d724e35f.png?AWSAccessKeyId=AKIAJF7IIRKHFCUKN6RQ&Expires=1514661611&Signature=gi%2BdO3t3F4is49KIT0jDzS39zus%3D&X-Amzn-Trace-Id=Root%3D1-5a43e45b-39f91d1aef0fcec146f0381d%3BParent%3Dd37d80d57cc7485a%3BSampled%3D0" />
				<span role="button" tabIndex={0} className="change-picture">CHANGE PICTURE</span>
				<h3 className="name">First Name</h3>
				<span className="name">Last Name</span>
			</section>
			<div className="email-section">
				<span className="title">E-MAIL</span>
				<div className="email">
					<SvgWrapper className="svg" height="30px" width="30px" svgid="email" />
					<span>emailaddress@mail.com</span>
				</div>
				<span role="button" tabIndex={0} className="button">CHANGE E-MAIL</span>
			</div>
			<div className="password-section">
				<span className="title">PASSWORD</span>
				<div className="password">
					<SvgWrapper className="svg" height="30px" width="30px" svgid="email" />
					<span>*********</span>
				</div>
				<span role="button" tabIndex={0} className="button">CHANGE PASSWORD</span>
			</div>
			<div className="address-section">
				<span className="title">ADDRESS</span>
				<div className="country">
					<SvgWrapper className="input-svg" height="30px" width="30px" svgid="email" />
					<input placeholder="Country" />
				</div>
				<div className="address-1">
					<input placeholder="Address Line 1" />
				</div>
				<div className="address-2">
					<input placeholder="Address Line 2" />
				</div>
				<div className="city">
					<input placeholder="City" />
				</div>
				<div className="state">
					<input placeholder="State/Province" />
				</div>
				<div className="postal-code">
					<input placeholder="Postal Code" />
				</div>
				<div className="button delete-account" role="button" tabIndex={0}>DELETE ACCOUNT</div>
			</div>
		</div>
	);
}

AccountSettings.propTypes = {

};

export default AccountSettings;
