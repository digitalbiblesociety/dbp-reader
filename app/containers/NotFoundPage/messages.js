/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
	headermessage: {
		id: 'app.components.NotFoundPage.headermessage',
		defaultMessage: 'This is not the page you are looking for.',
	},
	cause: {
		id: 'app.components.NotFoundPage.cause',
		defaultMessage: 'What could have caused this?',
	},
	technical: {
		id: 'app.components.NotFoundPage.technical',
		defaultMessage: 'Something technical went wrong on our side;',
	},
	moved: {
		id: 'app.components.NotFoundPage.moved',
		defaultMessage:
			'This might have been moved/lost in website re-development;',
	},
	clickedOld: {
		id: 'app.components.NotFoundPage.clickedOld',
		defaultMessage:
			'The link you clicked might be old and does not work anymore;',
	},
	accident: {
		id: 'app.components.NotFoundPage.accident',
		defaultMessage:
			'Or you might have accidentally typed the wrong URL in the address bar.',
	},
	youDo: {
		id: 'app.components.NotFoundPage.youDo',
		defaultMessage: 'What can you do?',
	},
	browser: {
		id: 'app.components.NotFoundPage.browser',
		defaultMessage:
			'Ensure you are running the latest version of your browser or download another browser such as chrome or firefox;',
	},
	tryAgain: {
		id: 'app.components.NotFoundPage.tryAgain',
		defaultMessage: 'You might retype the URL and try again;',
	},
	homePage: {
		id: 'app.components.NotFoundPage.homePage',
		defaultMessage: 'Or you can start fresh from our ',
	},
	homePageLink: {
		id: 'app.components.NotFoundPage.homePage',
		defaultMessage: 'home page.',
	},
	weKnow: {
		id: 'app.components.NotFoundPage.homePage',
		defaultMessage:
			"Just so you know, we have been notified that this page was not found, and if it's broken we will fix it.",
	},
});
