import React from 'react'
import renderer from 'react-test-renderer'
import {PleaseSignInMessage} from '..'

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const props = {
	dispatch: jest.fn(),
	message: 'accessNotebook'
}

describe('<PleaseSignInMessage /> Component', () => {
	it('Should match the previous snapshot', () => {
		const tree = renderer.create(<PleaseSignInMessage {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	})
})