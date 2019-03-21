export default ({
  audioSource: source,
  hasAudio,
  audioPlayerState,
  videoPlayerOpen,
  isScrollingDown,
  hasVideo,
}) => {
  let classNames = '';

  if (
    audioPlayerState &&
    hasAudio &&
    (!videoPlayerOpen || !hasVideo) &&
    source !== ''
  ) {
    classNames += 'audio-player-background';
  } else {
    classNames += 'audio-player-background closed';
  }

  if (isScrollingDown) {
    classNames += ' scrolled-down';
  }

  return classNames;
};
