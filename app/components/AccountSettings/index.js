/**
*
* AccountSettings
*
*/

// TODO: Get svg for password lock icon
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ImageComponent from 'components/ImageComponent';
import SvgWrapper from 'components/SvgWrapper';
import messages from './messages';

class AccountSettings extends React.PureComponent {
	state = {
		email: '',
		password: '',
		country: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
	}

	handleEmailChange = () => {
		const { currentEmail } = this.props.profile.email;
		const { newEmail } = this.state.email;
		if (newEmail !== currentEmail && newEmail) {
			// Dispatch action to change email
			// this.props.changeEmail({ email: newEmail });
		}
	}

	handlePasswordChange= () => {
		const { currentPassword } = this.props.profile.password;
		const { newPassword } = this.state.password;
		if (newPassword !== currentPassword && newPassword) {
			// this.props.changePassword({ password: newPassword });
		}
	}

	handleAccountDeletion = () => {
		// this.props.deleteAccount();
	}

	render() {
		const {
			logout,
			profile = {},
		} = this.props;
		const {
			email,
			password,
			country,
			address1,
			address2,
			city,
			state,
			zip,
		} = this.state;

		return (
			<div className="account-settings">
				<div role="button" tabIndex={0} onClick={logout} className="logout-button"><FormattedMessage {...messages.logout} /></div>
				<section className="personal-info">
					<ImageComponent classes="profile-picture" alt="Profile Picture" src={profile.picture || 'http://res.cloudinary.com/dw9eqwl1i/image/upload/v1500256772/IMG_1418_eoopkg.jpg'} />
					<span role="button" tabIndex={0} className="change-picture">CHANGE PICTURE</span>
					<h3 className="name">{profile.firstName || 'First Name'}</h3>
					<span className="name">{profile.lastName || 'Last Name'}</span>
				</section>
				<div className="email-section">
					<span className="title">E-MAIL</span>
					<div className="email">
						<SvgWrapper className="svg" height="30px" width="30px" svgid="email" />
						<input placeholder="emailaddress@mail.com" value={email || profile.email} />
					</div>
					<span role="button" tabIndex={0} className="button" onClick={this.handleEmailChange}>CHANGE E-MAIL</span>
				</div>
				<div className="password-section">
					<span className="title">PASSWORD</span>
					<div className="password">
						<SvgWrapper className="svg" height="30px" width="30px" svgid="email" />
						<input placeholder="**********" value={password || profile.password} />
					</div>
					<span role="button" tabIndex={0} className="button" onClick={this.handlePasswordChange}>CHANGE PASSWORD</span>
				</div>
				<div className="address-section">
					<span className="title">ADDRESS</span>
					<div className="country">
						<input placeholder="Country" value={country || profile.country} />
					</div>
					<div className="address-1">
						<input placeholder="Address Line 1" value={address1 || profile.address1} />
					</div>
					<div className="address-2">
						<input placeholder="Address Line 2" value={address2 || profile.address2} />
					</div>
					<div className="city">
						<input placeholder="City" value={city || profile.city} />
					</div>
					<div className="state">
						<input placeholder="State/Province" value={state || profile.state} />
					</div>
					<div className="postal-code">
						<input placeholder="Postal Code" value={zip || profile.zip} />
					</div>
					<div className="button delete-account" role="button" tabIndex={0} onClick={this.handleAccountDeletion}>DELETE ACCOUNT</div>
				</div>
			</div>
		);
	}
}

AccountSettings.propTypes = {
	logout: PropTypes.func,
	profile: PropTypes.object,
};

export default AccountSettings;
