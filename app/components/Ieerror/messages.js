/*
 * Ieerror Messages
 *
 * This contains all the text for the Ieerror component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
	noSupport: {
		id: 'app.components.Ieerror.noSupport',
		defaultMessage:
			'Bible.is does not support this feature on Internet Explorer. Please use one of the listed browsers instead:',
	},
	noSupportOr: {
		id: 'app.components.Ieerror.noSupportOr',
		defaultMessage: 'Or',
	},
	chrome: {
		id: 'app.components.Ieerror.chrome',
		defaultMessage: 'Chrome',
	},
	firefox: {
		id: 'app.components.Ieerror.firefox',
		defaultMessage: 'Firefox',
	},
});
