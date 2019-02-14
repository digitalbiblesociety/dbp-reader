import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import AudioOnlyMessage from '..';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const book = 'Romans';
const chapter = 8;

describe('AudioOnlyMessage Component', () => {
	it('Should match previous snapshot', () => {
		const tree = renderer.create(
			<AudioOnlyMessage book={book} chapter={chapter} />,
		);

		expect(tree).toMatchSnapshot();
	});
	it('Should render a div containing given book and chapter', () => {
		const wrapper = shallow(<AudioOnlyMessage book={book} chapter={chapter} />);

		expect(
			wrapper
				.find('p')
				.text()
				.includes(book),
		).toBe(true);
		expect(
			wrapper
				.find('p')
				.text()
				.includes(chapter),
		).toBe(true);
	});
});
