import React from 'react';
import renderer from 'react-test-renderer';

import PlaybackRateSvg from '..';

describe('<PlaybackRateSvg /> component tests', () => {
  it('Should match snapshot with default props', () => {
    const tree = renderer.create(<PlaybackRateSvg playbackRate={1} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('Should match snapshot with 0.75 speed', () => {
    const tree = renderer
      .create(<PlaybackRateSvg playbackRate={0.75} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('Should match snapshot with 1.25 speed', () => {
    const tree = renderer
      .create(<PlaybackRateSvg playbackRate={1.25} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('Should match snapshot with 1.5 speed', () => {
    const tree = renderer
      .create(<PlaybackRateSvg playbackRate={1.5} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('Should match snapshot with 2 speed', () => {
    const tree = renderer.create(<PlaybackRateSvg playbackRate={2} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('Should match snapshot with no playback speed', () => {
    const tree = renderer.create(<PlaybackRateSvg />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
