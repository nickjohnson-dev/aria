import { connect } from 'react-redux';
import audio from '../../../audio';
import location from '../../../location';
import shared from '../../../shared';
import song from '../../../song';
import { App } from './App';

export const AppContainer = connect(state => ({
  locationType: location.selectors.getType(state),
  playbackState: audio.selectors.getPlaybackState(state),
  stringifiedSong: song.selectors.getStringifiedSong(state),
}), {
  onFileDragStart: shared.actions.fileDragStarted,
  onPause: shared.actions.playbackPauseRequestStarted,
  onPlay: shared.actions.playbackStartRequestStarted,
  onStop: shared.actions.playbackStopRequestStarted,
  onUpload: shared.actions.songLoaded,
  onUploadCancel: shared.actions.fileDragCancelled,
})(App);
