import first from 'lodash/fp/first';
import tail from 'lodash/fp/tail';

import * as actions from '../../../actions';
import { DiffInterpreter } from '../../../types';
import { interpretBPMEditedDiff } from './interpretBPMEditedDiff';
import { interpretFocusedSequenceIdEditedDiff } from './interpretFocusedSequenceIdEditedDiff';
import { interpretMeasureCountEditedDiff } from './interpretMeasureCountEditedDiff';
import { interpretNotesDiff } from './interpretNotesDiff';
import { interpretSequencesDiff } from './interpretSequencesDiff';
import { interpretTracksDiff } from './interpretTracksDiff';

export const interpretDiff: DiffInterpreter = (diff, song) => {
  const editedProperty = first(diff.path);
  const childDiff = { ...diff, path: tail(diff.path) };

  switch (editedProperty) {
    case 'bpm':
      return interpretBPMEditedDiff(childDiff);
    case 'focusedSequenceId':
      return interpretFocusedSequenceIdEditedDiff(childDiff);
    case 'measureCount':
      return interpretMeasureCountEditedDiff(childDiff);
    case 'notes':
      return interpretNotesDiff(childDiff);
    case 'sequences':
      return interpretSequencesDiff(childDiff);
    case 'tracks':
      return interpretTracksDiff(childDiff, song);
    default:
      return actions.unknown();
  }
};
