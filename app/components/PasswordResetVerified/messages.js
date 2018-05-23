/*
 * PasswordResetVerified Messages
 *
 * This contains all the text for the PasswordResetVerified component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
	title: {
		id: 'app.components.PasswordResetVerified.title',
		defaultMessage: 'Reset Password',
	},
	passwordLength: {
		id: 'app.components.PasswordResetVerified.passwordLength',
		defaultMessage: 'The password must contain at least 6 characters.',
	},
	changePassword: {
		id: 'app.components.PasswordResetVerified.changePassword',
		defaultMessage: 'Change Password',
	},
	unableToResetPart1: {
		id: 'app.components.PasswordResetVerified.unableToResetPart1',
		defaultMessage: 'If you are unable to reset your password, please',
	},
	unableToResetPart2: {
		id: 'app.components.PasswordResetVerified.unableToResetPart2',
		defaultMessage: 'for support.',
	},
	passwordError1: {
		id: 'app.components.PasswordResetVerified.passwordError1',
		defaultMessage: 'Please ensure both passwords match.',
	},
	passwordError2: {
		id: 'app.components.PasswordResetVerified.passwordError2',
		defaultMessage: 'Please enter a password longer than 8 characters.',
	},
	passwordError3: {
		id: 'app.components.PasswordResetVerified.passwordError3',
		defaultMessage: 'You are not allowed to use "password1" as your password.',
	},
	passwordError4: {
		id: 'app.components.PasswordResetVerified.passwordError4',
		defaultMessage: 'You must have at least one of the following: number, uppercase character, symbol.',
	},
	passwordErrorUnknown: {
		id: 'app.components.PasswordResetVerified.passwordErrorUnknown',
		defaultMessage: 'There was an unknown error, please try again.',
	},
	emailError: {
		id: 'app.components.PasswordResetVerified.passwordErrorUnknown',
		defaultMessage: 'Please enter a valid e-mail',
	},
});
