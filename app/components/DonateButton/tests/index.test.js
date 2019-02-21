import React from 'react';
import renderer from 'react-test-renderer';
import { DonateButton } from '..';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

describe('<DonateButton /> component', () => {
	it('should match snapshot of paper theme', () => {
		const tree = renderer.create(<DonateButton theme={'paper'} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot of red theme', () => {
		const tree = renderer.create(<DonateButton theme={'red'} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot of dark theme', () => {
		const tree = renderer.create(<DonateButton theme={'dark'} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
