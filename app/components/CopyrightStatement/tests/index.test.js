import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import CopyrightStatement from '..';

import { copyrights } from '../../../utils/testUtils/copyrightData';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const props = {
	organizations: copyrights.newTestament.text.organizations,
	testament: 'new_testament',
	type: 'text',
};

describe('CopyrightStatement component', () => {
	it('should match snapshot with valid new testament text props', () => {
		const tree = renderer.create(<CopyrightStatement {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with valid new testament audio props', () => {
		const tree = renderer
			.create(
				<CopyrightStatement
					organizations={copyrights.newTestament.audio.organizations}
					testament={'new_testament'}
					type={'audio'}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should render a logo if organization has one', () => {
		const wrapper = mount(<CopyrightStatement {...props} />);

		expect(wrapper.find('img').length).toEqual(1);
	});
	it('should not render a logo if organization does not have one', () => {
		const customProps = { ...props };
		delete customProps.organizations[0].logo;
		const wrapper = mount(<CopyrightStatement {...customProps} />);

		expect(wrapper.find('img').length).toEqual(0);
	});
});
