/**
*
* AccountSettings
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// TODO: Get svg for password lock icon

import { FormattedMessage } from 'react-intl';
import ImageComponent from 'components/ImageComponent';
import messages from './messages';
import SvgWrapper from '../SvgWrapper/index';

function AccountSettings({ logout }) {
	return (
		<div className="account-settings">
			<div role="button" tabIndex={0} onClick={logout} className="logout-button"><FormattedMessage {...messages.logout} /></div>
			<section className="personal-info">
				<ImageComponent classes="profile-picture" alt="Profile Picture" src="http://res.cloudinary.com/dw9eqwl1i/image/upload/v1500256772/IMG_1418_eoopkg.jpg" />
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
	logout: PropTypes.func,
};

export default AccountSettings;
