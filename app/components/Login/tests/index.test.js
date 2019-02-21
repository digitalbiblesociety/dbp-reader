import React from 'react';
import renderer from 'react-test-renderer';
import Login from '..';

/* eslint-disable react/prop-types */
jest.mock('../../../containers/GoogleAuthentication', () => (props) => (
	<div
		role={'button'}
		id={'google-login'}
		tabIndex={0}
		className={'google'}
		onClick={props.handleSocialLogin}
	>
		Sign in with Google
	</div>
));
jest.mock('../../../containers/FacebookAuthentication', () => (props) => (
	<div
		role={'button'}
		id={'facebook-login'}
		tabIndex={0}
		className={'facebook'}
		onClick={props.handleSocialLogin}
	>
		Sign in with Facebook
	</div>
));
/* eslint-enable react/prop-types */

const props = {
	sendLoginForm: jest.fn(),
	socialMediaLogin: jest.fn(),
	viewErrorMessage: jest.fn(),
	selectAccountOption: jest.fn(),
	readOauthError: jest.fn(),
	socialLoginLink: 'google',
	oauthErrorMessage: '',
	errorMessage: '',
	activeDriver: 'google',
	oauthError: false,
	errorMessageViewed: false,
};

describe('<Login /> component', () => {
	it('should match snapshot with expected props', () => {
		const tree = renderer.create(<Login {...props} />);
		expect(tree).toMatchSnapshot();
	});
});
