import { combineReducers } from 'redux';
import appData from '../features/app-data';
import audioClientData from '../features/audio-client-data';
import contextMenu from '../features/context-menu';
import sequenceData from '../features/sequence-data';
import shared from '../features/shared';
import shortcuts from '../features/shortcuts';
import song from '../features/song';
import tracksData from '../features/tracks-data';
import transport from '../features/transport';

export default combineReducers({
  [appData.constants.NAME]: appData.reducer,
  [audioClientData.constants.NAME]: audioClientData.reducer,
  [contextMenu.constants.NAME]: contextMenu.reducer,
  [sequenceData.constants.NAME]: sequenceData.reducer,
  [shared.constants.NAME]: shared.reducer,
  [shortcuts.constants.NAME]: shortcuts.reducer,
  [song.constants.NAME]: song.reducer,
  [tracksData.constants.NAME]: tracksData.reducer,
  [transport.constants.NAME]: transport.reducer,
});
