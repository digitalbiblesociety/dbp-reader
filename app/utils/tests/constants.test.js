import * as constants from '../constants';

describe('Test contstants in utils', () => {
	it('should match old snapshot', () => {
		const tree = JSON.stringify(constants);
		expect(tree).toMatchSnapshot();
	});
});
