import React from 'react';
import renderer from 'react-test-renderer';
import {
	copyrights,
	invalidCopyrights,
	invalidCopyrights2,
} from '../../../utils/testUtils/copyrightData';
import CopyrightStatement from '..';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const props = {
	prefix: 'new',
	copyrights,
};

describe('CopyrightStatement component', () => {
	it('should match previous snapshot for new testament', () => {
		const tree = renderer.create(<CopyrightStatement {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match previous snapshot for old testament', () => {
		const tree = renderer
			.create(<CopyrightStatement {...props} prefix={'old'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match previous snapshot for new testament invalid data', () => {
		const tree = renderer
			.create(
				<CopyrightStatement prefix={'new'} copyrights={invalidCopyrights} />,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match previous snapshot for old testament invalid data', () => {
		const tree = renderer
			.create(
				<CopyrightStatement prefix={'old'} copyrights={invalidCopyrights} />,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match previous snapshot for old testament invalid data where there are no messages', () => {
		const tree = renderer
			.create(
				<CopyrightStatement prefix={'old'} copyrights={invalidCopyrights2} />,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match previous snapshot for no copyright data', () => {
		const tree = renderer
			.create(<CopyrightStatement prefix={'old'} copyrights={{}} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
