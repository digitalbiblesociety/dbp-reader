/**
 *
 * PlaybackRateSvg
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../SvgWrapper';

const PlaybackRateSvg = ({ playbackRate }) => {
  // If speed came from cookie it is stored as a string since there is not a parse float
  if (playbackRate === 0.75) {
    return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_0.75x" />;
  } else if (playbackRate === 1) {
    return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_1x" />;
  } else if (playbackRate === 1.25) {
    return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_1.25x" />;
  } else if (playbackRate === 1.5) {
    return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_1.5x" />;
  }
  return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_2x" />;
};

PlaybackRateSvg.propTypes = {
  playbackRate: PropTypes.number,
};

export default PlaybackRateSvg;
