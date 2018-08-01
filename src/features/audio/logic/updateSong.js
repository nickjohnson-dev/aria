import { createLogic } from 'redux-logic';
import shared from '../../shared';
import song from '../../song';
import dawww from '../dawww';

export const updateSong = createLogic({
  type: [
    shared.actions.BPM_SET,
    shared.actions.MEASURE_COUNT_SET,
    shared.actions.NOTE_DRAWN,
    shared.actions.NOTE_ERASED,
    shared.actions.NOTES_DELETED,
    shared.actions.NOTES_DRAGGED,
    shared.actions.NOTES_DUPLICATED,
    shared.actions.NOTES_MOVED_OCTAVE_DOWN,
    shared.actions.NOTES_MOVED_OCTAVE_UP,
    shared.actions.NOTES_NUDGED,
    shared.actions.NOTES_RESIZED,
    shared.actions.SEQUENCE_ADDED,
    shared.actions.SEQUENCE_DELETED,
    shared.actions.SEQUENCE_EXTENDED,
    shared.actions.SEQUENCER_LOADED,
    shared.actions.TRACKER_LOADED,
    shared.actions.SEQUENCE_NUDGED_LEFT,
    shared.actions.SEQUENCE_NUDGED_RIGHT,
    shared.actions.SEQUENCE_SHORTENED,
    shared.actions.SONG_EXTENDED,
    shared.actions.SONG_SHORTENED,
    shared.actions.TRACK_ADDED,
    shared.actions.TRACK_DELETED,
    shared.actions.TRACK_IS_MUTED_TOGGLED,
    shared.actions.TRACK_IS_SOLOING_TOGGLED,
    shared.actions.TRACK_VOICE_SET,
  ],
  process({ getState }, dispatch, done) {
    const songState = song.selectors.getSong(getState());

    dawww.updateSong(songState);

    done();
  },
});