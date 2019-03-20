export default ({
  audioSource: source,
  hasAudio,
  audioPlayerState,
  videoPlayerOpen,
  hasVideo,
  isScrollingDown,
}) => {
  let classNames = '';

  if (
    audioPlayerState &&
    hasAudio &&
    (!videoPlayerOpen || !hasVideo) &&
    source !== ''
  ) {
    classNames += 'audioplayer-handle';
  } else {
    classNames += 'audioplayer-handle closed';
  }

  if (isScrollingDown) {
    classNames += ' scrolled-down';
  }

  return classNames;
};
