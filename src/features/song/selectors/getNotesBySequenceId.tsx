import filter from 'lodash/fp/filter';
import memoize from 'lodash/fp/memoize';
import { createSelector } from 'reselect';
import { getNotesArray } from './getNotesArray';

export const getNotesBySequenceId = createSelector(
  getNotesArray,
  notesArray =>
    memoize(sequenceId =>
      filter(note => note.sequenceId === sequenceId, notesArray),
    ),
);