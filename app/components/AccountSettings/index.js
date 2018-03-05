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
		password: this.props.profile.password,
		// country: this.props.profile.country,
		// address1: this.props.profile.address1,
		// address2: this.props.profile.address2,
		// city: this.props.profile.city,
		// state: this.props.profile.state,
		// zip: this.props.profile.zip,
	}

	handleEmailChange = (e) => {
		this.setState({ email: e.target.value });
	}

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
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

	sendUpdatePassword = () => {
		const currentPassword = this.props.profile.password;
		const newPassword = this.state.password;

		if (newPassword !== currentPassword && newPassword) {
			this.props.updatePassword({ password: newPassword, userId: this.props.userId });
		}
	}

	// sendUpdateUserInformation = () => {
	// 	const { country, address1, address2, city, state, zip } = this.state;
	// 	const { userId } = this.props;
	// 	const profile = { country, address1, address2, city, state, zip };
	//
	// 	this.props.updateUserInformation({ profile, userId });
	// }

	render() {
		const {
			logout,
			profile,
		} = this.props;
		const {
			email,
			password,
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
					<ImageComponent classes="profile-picture" alt="Profile Picture" src={profile.picture || 'http://res.cloudinary.com/dw9eqwl1i/image/upload/v1500256772/IMG_1418_eoopkg.jpg'} />
					<span role="button" tabIndex={0} className="change-picture">CHANGE PICTURE</span>
					<h3 className="name">{profile.firstName || 'First Name'}</h3>
					<span className="name">{profile.lastName || 'Last Name'}</span>
				</section>
				<div className="email-section">
					<span className="title">E-MAIL</span>
					<div className="email">
						<SvgWrapper className="svg" height="30px" width="30px" svgid="email" />
						<input onChange={this.handleEmailChange} placeholder="emailaddress@mail.com" value={email} />
					</div>
					<span role="button" tabIndex={0} className="button" onClick={this.sendUpdateEmail}>CHANGE E-MAIL</span>
				</div>
				<div className="password-section">
					<span className="title">PASSWORD</span>
					<div className="password">
						<SvgWrapper className="svg" height="30px" width="30px" svgid="email" />
						<input onChange={this.handlePasswordChange} type={'password'} placeholder="**********" value={password} />
					</div>
					<span role="button" tabIndex={0} className="button" onClick={this.sendUpdatePassword}>CHANGE PASSWORD</span>
				</div>
				<div className="address-section">
					{/* <span className="title">ADDRESS</span> */}
					{/* <div className="country"> */}
					{/* <input onChange={(e) => this.handleAddressFieldChange(e, 'country')} placeholder="Country" value={country} /> */}
					{/* </div> */}
					{/* <div className="address-1"> */}
					{/* <input onChange={(e) => this.handleAddressFieldChange(e, 'address1')} placeholder="Address Line 1" value={address1} /> */}
					{/* </div> */}
					{/* <div className="address-2"> */}
					{/* <input onChange={(e) => this.handleAddressFieldChange(e, 'address2')} placeholder="Address Line 2" value={address2} /> */}
					{/* </div> */}
					{/* <div className="city"> */}
					{/* <input onChange={(e) => this.handleAddressFieldChange(e, 'city')} placeholder="City" value={city} /> */}
					{/* </div> */}
					{/* <div className="state"> */}
					{/* <input onChange={(e) => this.handleAddressFieldChange(e, 'state')} placeholder="State/Province" value={state} /> */}
					{/* </div> */}
					{/* <div className="postal-code"> */}
					{/* <input onChange={(e) => this.handleAddressFieldChange(e, 'zip')} placeholder="Postal Code" value={zip} /> */}
					{/* </div> */}
					<div className="button delete-account" role="button" tabIndex={0} onClick={this.handleAccountDeletion}>DELETE ACCOUNT</div>
				</div>
			</div>
		);
	}
}

AccountSettings.propTypes = {
	logout: PropTypes.func,
	deleteUser: PropTypes.func,
	updateEmail: PropTypes.func,
	updatePassword: PropTypes.func,
	// updateUserInformation: PropTypes.func,
	profile: PropTypes.object,
	userId: PropTypes.string,
};

export default AccountSettings;
