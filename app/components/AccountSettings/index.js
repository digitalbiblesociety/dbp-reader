/**
*
* AccountSettings
*
*/

// TODO: Get svg for password lock icon
// Add element for saving the address information
// Commented out all of the Address information code in case FCBH changes their mind and still wants it
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ImageComponent from 'components/ImageComponent';
import SvgWrapper from 'components/SvgWrapper';
import messages from './messages';

class AccountSettings extends React.PureComponent {
	state = {
		email: this.props.profile.email,
		nickname: this.props.profile.nickname,
		name: this.props.profile.name,
		avatar: this.props.profile.avatar,
	}

	handleEmailChange = (e) => {
		this.setState({ email: e.target.value });
	}

	handleAccountDeletion = () => {
		this.props.deleteUser({ userId: this.props.userId });
	}

	// handleAddressFieldChange = (e, field) => {
	// 	this.setState({
	// 		[field]: e.target.value,
	// 	});
	// }

	sendUpdateEmail = () => {
		const currentEmail = this.props.profile.email;
		const newEmail = this.state.email;

		if (newEmail !== currentEmail && newEmail) {
			// Dispatch action to change email
			this.props.updateEmail({ email: newEmail, userId: this.props.userId });
		}
	}

	// sendUpdateUserInformation = () => {
	// 	const { country, address1, address2, city, state, zip } = this.state;
	// 	const { userId } = this.props;
	// 	const profile = { country, address1, address2, city, state, zip };
	//
	// 	this.props.updateUserInformation({ profile, userId });
	// }
	changePicture = () => {
		// Need to implement some sort of image upload thing here
		// Or need to have a short dialogue indicating to the user that they need to use a link
	}

	render() {
		const {
			logout,
			profile,
		} = this.props;
		const {
			email,
			// country,
			// address1,
			// address2,
			// city,
			// state,
			// zip,
		} = this.state;

		return (
			<div className="account-settings">
				<div role="button" tabIndex={0} onClick={logout} className="logout-button"><FormattedMessage {...messages.logout} /></div>
				<section className="personal-info">
					<ImageComponent classes="profile-picture" alt="Profile Picture" src={profile.avatar || 'http://res.cloudinary.com/dw9eqwl1i/image/upload/v1500256772/IMG_1418_eoopkg.jpg'} />
					<button onClick={this.changePicture} className="change-picture">Change Picture</button>
					<h3 className="name">{profile.nickname || 'First Name'}</h3>
					<span className="name">{profile.name || 'Last Name'}</span>
				</section>
				<div className="email-section">
					<span className="title">e-mail</span>
					<span className="wrapper">
						<SvgWrapper className="icon" height="26px" width="26px" svgid="e-mail" />
						<input onChange={this.handleEmailChange} placeholder="emailaddress@mail.com" value={email} />
					</span>
					<span role="button" tabIndex={0} className="button" onClick={this.sendUpdateEmail}>Change e-mail</span>
				</div>
				<div className="button delete-account" role="button" tabIndex={0} onClick={this.handleAccountDeletion}>Delete Account</div>
			</div>
		);
	}
}

AccountSettings.propTypes = {
	logout: PropTypes.func,
	deleteUser: PropTypes.func,
	updateEmail: PropTypes.func,
	// updateUserInformation: PropTypes.func,
	profile: PropTypes.object,
	userId: PropTypes.string,
};

export default AccountSettings;
