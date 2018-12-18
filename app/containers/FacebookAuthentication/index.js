/**
 *
 * FacebookAuthentication
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SvgWrapper from '../../components/SvgWrapper';
import PopupMessage from '../../components/PopupMessage';
import { createUserWithSocialAccount } from '../HomePage/actions';

export class FacebookAuthentication extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		popupOpen: false,
		popupCoords: { x: 0, y: 0 },
		oauthError: '',
		oauthErrorMessage: '',
	};

	componentWillReceiveProps(nextProps) {
		if (
			!this.state.popupOpen &&
			nextProps.oauthError &&
			nextProps.oauthErrorMessage
		) {
			this.openPopup(
				{ clientX: 150, clientY: 300 },
				nextProps.oauthError,
				nextProps.oauthErrorMessage,
			);
		}
	}

	handleSocialLogin = () => {
		this.props.dispatch(createUserWithSocialAccount({ provider: 'facebook' }));
	};

	openPopup = (e, error, message) => {
		const coords = { x: e.clientX || 150, y: e.clientY || 300 };
		this.setState({
			popupOpen: true,
			popupCoords: coords,
			oauthError: error,
			oauthErrorMessage: message,
		});
		setTimeout(
			() =>
				this.setState({ popupOpen: false }, () => this.props.readOauthError()),
			2500,
		);
	};

	render() {
		const { oauthErrorMessage } = this.state;

		return (
			<div
				role={'button'}
				id={'facebook-login'}
				tabIndex={0}
				onClick={this.handleSocialLogin}
				className="facebook"
			>
				<SvgWrapper
					className="svg"
					height="30px"
					width="30px"
					fill="#fff"
					svgid="facebook"
				/>
				Sign in with Facebook
				{this.state.popupOpen ? (
					<PopupMessage
						y={this.state.popupCoords.y}
						x={this.state.popupCoords.x}
						styles={{ maxHeight: 80 }}
						message={
							oauthErrorMessage ||
							'This functionality is currently unavailable.'
						}
					/>
				) : null}
			</div>
		);
	}
}

FacebookAuthentication.propTypes = {
	oauthError: PropTypes.bool,
	oauthErrorMessage: PropTypes.string,
	readOauthError: PropTypes.func,
	dispatch: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	null,
	mapDispatchToProps,
);

export default compose(withConnect)(FacebookAuthentication);
