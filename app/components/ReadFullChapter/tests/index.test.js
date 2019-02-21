import React from 'react';
import renderer from 'react-test-renderer';
import ReadFullChapter from '..';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const props = {
	activeTextId: 'ENGESV',
	activeBookId: 'GEN',
	activeChapter: 1,
};

describe('ReadFullChapter component', () => {
	it('should match previous snapshot', () => {
		const tree = renderer.create(<ReadFullChapter {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
