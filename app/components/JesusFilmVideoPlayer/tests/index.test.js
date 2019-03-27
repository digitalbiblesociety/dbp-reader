import React from 'react';
import renderer from 'react-test-renderer';

import JesusFilmVideoPlayer from '..';

describe('<JesusFilmVideoPlayer /> component tests', () => {
	it('Should match snapshot with default props', () => {
		const tree = renderer.create(<JesusFilmVideoPlayer />).toJSON();

		expect(tree).toMatchSnapshot();
	});
});
