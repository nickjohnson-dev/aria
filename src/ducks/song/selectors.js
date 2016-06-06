import _ from 'lodash';
import { createSelector } from 'reselect';
import transport from 'ducks/transport';
import { NAME } from './constants';

const get = state => state[NAME];

export const getActiveSequenceId = (state) => get(state).activeSequenceId;
export const getBPM = (state) => get(state).bpm || transport.constants.defaultBPM;
export const getMeasureCount = (state) => get(state).measureCount || 1;
export const getName = (state) => get(state).name || '';
export const getNotesDict = (state) => get(state).notes.dict;
export const getNotesIds = (state) => get(state).notes.ids;
export const getSequencesDict = (state) => get(state).sequences.dict;
export const getSequencesIds = (state) => get(state).sequences.ids;
export const getTracksDict = (state) => get(state).tracks.dict;
export const getTracksIds = (state) => get(state).tracks.ids;

// --- Notes ---

export const getNoteById = (id) => createSelector(
  getNotesDict,
  (dict) => dict[id],
);

export const getNotes = createSelector(
  getNotesIds,
  getNotesDict,
  (ids, dict) => ids.map(id => dict[id]),
);

export const getNotesBySequenceId = (sequenceId) => createSelector(
  getNotes,
  (notes) => _.filter(notes, { sequenceId }),
);

// --- Sequence ---

export const getSequenceById = (id) => createSelector(
  getSequencesDict,
  (dict) => dict[id],
);

export const getSequences = createSelector(
  getSequencesIds,
  getSequencesDict,
  (ids, dict) => ids.map(id => dict[id]),
);

export const getSequencesByTrackId = (trackId) => createSelector(
  getSequences,
  (sequences) => _.filter(sequences, { trackId }),
);

// --- Active Sequence ---

export const getActiveSequence = createSelector(
  getActiveSequenceId,
  getSequencesDict,
  (id, dict) => dict[id],
);

export const getActiveSequenceMeasureCount = createSelector(
  getActiveSequence,
  (sequence) => (sequence ? sequence.measureCount : 0),
);

export const getActiveSequenceNotes = createSelector(
  getNotes,
  getActiveSequenceId,
  (notes, sequenceId) => _.filter(notes, { sequenceId }),
);

// --- Tracks ---

export const getTrackById = (id) => createSelector(
  getTracksDict,
  (dict) => dict[id],
);

export const getTracks = createSelector(
  getTracksIds,
  getTracksDict,
  (ids, dict) => ids.map(id => dict[id]),
);

export const getTracksWithSequences = createSelector(
  getTracks,
  getSequences,
  (tracks, sequences) => tracks.map(track => ({
    ...track,
    sequences: _.filter(sequences, { trackId: track.id }),
  })),
);
