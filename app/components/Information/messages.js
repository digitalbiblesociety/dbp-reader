/*
 * Information Messages
 *
 * This contains all the text for the Information component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
	header: {
		id: 'app.components.Information.header',
		defaultMessage: 'This is the Information component !',
	},
	providedByAudio: {
		id: 'app.components.Information.providedByAudio',
		defaultMessage: 'This Bible audio is brought to you by:',
	},
	providedByText: {
		id: 'app.components.Information.providedByText',
		defaultMessage: 'This Bible text is brought to you by:',
	},
});
