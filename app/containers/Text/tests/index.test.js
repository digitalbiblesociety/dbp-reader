// import React from 'react';
// import { shallow } from 'enzyme';

import Text from '../index';

describe('<Text />', () => {
	it('Expect to have unit tests specified', () => {
		expect(true).toEqual(true);
	});
	describe('addHighlight', () => {
		it('Should be defined', () => {
			expect(Text.addHighlight).toBeDefined();
		});
		it('Should be a function', () => {
			expect(typeof Text.addHighlight === 'function').toEqual(true);
		});
	});
});
