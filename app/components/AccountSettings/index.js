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
			<FormattedMessage {...messages.logout} />
			<section className="personal-info">
				<ImageComponent className="profile-picture" alt="Profile Picture" src="https://s3.amazonaws.com/resources-live.sketch.cloud/files/fe8cf8bd-87d5-4e2c-a2b7-7db3d724e35f.png?AWSAccessKeyId=AKIAJF7IIRKHFCUKN6RQ&Expires=1514661611&Signature=gi%2BdO3t3F4is49KIT0jDzS39zus%3D&X-Amzn-Trace-Id=Root%3D1-5a43e45b-39f91d1aef0fcec146f0381d%3BParent%3Dd37d80d57cc7485a%3BSampled%3D0" />
				<h3>First Name</h3>
				<h4>Last Name</h4>
			</section>
			<div className="email-section">
				<h5>E-MAIL</h5>
				<div className="email">
					<SvgWrapper height="30px" width="30px" svgid="email" />
					<h4>emailaddress@mail.com</h4>
				</div>
				<span role="button" tabIndex={0} className="button">CHANGE E-MAIL</span>
			</div>
			<div className="password-section">
				<h5>PASSWORD</h5>
				<div className="password">
					<SvgWrapper height="30px" width="30px" svgid="email" />
					<h4>***********</h4>
				</div>
				<span role="button" tabIndex={0} className="button">CHANGE PASSWORD</span>
			</div>
			<div className="address-section">
				<h5>ADDRESS</h5>
				<div className="country">
					<SvgWrapper height="30px" width="30px" svgid="email" />
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
			</div>
			<div className="button delete-account" role="button" tabIndex={0}>DELETE ACCOUNT</div>
		</div>
	);
}

AccountSettings.propTypes = {

};

export default AccountSettings;
