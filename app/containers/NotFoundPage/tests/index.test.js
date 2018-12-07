import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import NotFoundPage from '../../../../pages/NotFoundPage/index';
import messages from '../messages';

describe('<NotFoundPage />', () => {
	it('should render the page message', () => {
		const renderedComponent = shallow(<NotFoundPage />);
		expect(
			renderedComponent.contains(<FormattedMessage {...messages.header} />),
		).toEqual(true);
	});
});
