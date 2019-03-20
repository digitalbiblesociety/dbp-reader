import getClassNamesForAudioHandle from '../getClassNamesForAudioHandle';
import getClassNamesForAudioBackground from '../getClassNamesForAudioBackground';

describe('Get classnames for audio player utility functions', () => {
  it('should get the classnames for the background', () => {
    const classnames = getClassNamesForAudioBackground({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: false,
      hasVideo: false,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audio-player-background');
  });
  it('should get the classnames for the background when closed', () => {
    const classnames = getClassNamesForAudioBackground({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: false,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audio-player-background closed');
  });
  it('should get the classnames for the background when no video', () => {
    const classnames = getClassNamesForAudioBackground({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: false,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audio-player-background');
  });
  it('should get the classnames for the background when video closed', () => {
    const classnames = getClassNamesForAudioBackground({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: false,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audio-player-background');
  });
  it('should get the classnames for the background when no audio', () => {
    const classnames = getClassNamesForAudioBackground({
      source: 'valid',
      hasAudio: false,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audio-player-background closed');
  });
  it('should get the classnames for the background when no audio source', () => {
    const classnames = getClassNamesForAudioBackground({
      source: '',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audio-player-background closed');
  });
  it('should get the classnames for the background when scrolling down', () => {
    const classnames = getClassNamesForAudioBackground({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: true,
    });
    expect(classnames).toEqual('audio-player-background closed scrolled-down');
  });
  it('should get the classnames for the handle', () => {
    const classnames = getClassNamesForAudioHandle({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: false,
      hasVideo: false,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audioplayer-handle');
  });
  it('should get the classnames for the handle when closed', () => {
    const classnames = getClassNamesForAudioHandle({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: false,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audioplayer-handle closed');
  });
  it('should get the classnames for the handle when no video', () => {
    const classnames = getClassNamesForAudioHandle({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: false,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audioplayer-handle');
  });
  it('should get the classnames for the handle when video closed', () => {
    const classnames = getClassNamesForAudioHandle({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: false,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audioplayer-handle');
  });
  it('should get the classnames for the handle when no audio', () => {
    const classnames = getClassNamesForAudioHandle({
      source: 'valid',
      hasAudio: false,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audioplayer-handle closed');
  });
  it('should get the classnames for the handle when no audio source', () => {
    const classnames = getClassNamesForAudioHandle({
      source: '',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: false,
    });
    expect(classnames).toEqual('audioplayer-handle closed');
  });
  it('should get the classnames for the handle when scrolling down', () => {
    const classnames = getClassNamesForAudioHandle({
      source: 'valid',
      hasAudio: true,
      audioPlayerState: true,
      videoPlayerOpen: true,
      hasVideo: true,
      isScrollingDown: true,
    });
    expect(classnames).toEqual('audioplayer-handle closed scrolled-down');
  });
});
