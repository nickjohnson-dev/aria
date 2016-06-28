import _ from 'lodash';
import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import playing from 'ducks/playing';
import sequencing from 'ducks/sequencing';
import shortcuts from 'ducks/shortcuts';
import song from 'ducks/song';
import * as actions from './actions';
import * as actionTypes from './action-types';
import * as helpers from './helpers';
import * as selectors from './selectors';

function* changeSelectedNotesSize({ change }) {
  const selectedNotes = yield select(selectors.getSelectedNotes);
  yield put(actions.notesResized(selectedNotes, change));
}

function* drawNote() {
  const activeSequenceId = yield select(song.selectors.getActiveSequenceId);
  const point = yield select(sequencing.selectors.getMousePoint);

  yield put(playing.actions.notePreviewed(point));
  yield put(song.actions.noteAdded(song.helpers.createNote({
    points: [point, { x: point.x + 1, y: point.y }],
    sequenceId: activeSequenceId,
  })));
}

function* duplicateNotes() {
  const selectedNotes = yield select(selectors.getSelectedNotes);

  if (_.isEmpty(selectedNotes)) return;

  const newNotes = selectedNotes.map(note => song.helpers.createNote({
    points: note.points,
    sequenceId: note.sequenceId,
  }));

  yield put(song.actions.notesAdded(newNotes));
  yield put(actions.notesSelected(newNotes));
}

function* erase(action) {
  yield put(actions.notesRemoved([action.note]));
}

function* moveNotes({ notes, offset }) {
  const measureCount = yield select(song.selectors.getActiveSequenceMeasureCount);
  const updatedNotes = notes.map(note => ({
    ...note,
    points: note.points.map(point => helpers.addPoints(point, offset)),
  }));

  if (
    (helpers.somePointOutside(_.map(updatedNotes, n => n.points[0]), measureCount)) ||
    (helpers.somePointOutside(_.map(updatedNotes, n => n.points[1]), measureCount))
  ) return;

  yield put(playing.actions.notePreviewed(_.first(updatedNotes[0].points)));
  yield put(song.actions.notesUpdated(updatedNotes));
}

function* moveSelected({ offset }) {
  const selectedNotes = yield select(selectors.getSelectedNotes);

  if (_.isEmpty(selectedNotes)) return;

  yield put(actions.notesMoved(selectedNotes, offset));
}

function* nudgeSelectedNotesPosition({ change }) {
  const selectedNotes = yield select(selectors.getSelectedNotes);

  if (_.isEmpty(selectedNotes)) return;

  yield put(actions.notesMoved(selectedNotes, change));
}

function* nudgeSelectedNotesSize({ change }) {
  yield put(actions.selectedNotesSizeChanged({ change }));
}

function* pushRedo() {
  const allNotes = yield select(song.selectors.getActiveSequenceNotes);
  const redos = yield select(selectors.getRedos);

  yield put(actions.redosSet([
    ...redos,
    allNotes,
  ]));
}

function* pushUndo() {
  const allNotes = yield select(song.selectors.getActiveSequenceNotes);
  const undos = yield select(selectors.getUndos);

  if (_.isEqual(_.last(undos), allNotes)) return;

  yield put(actions.undosSet([
    ...undos,
    allNotes,
  ]));
  yield put(actions.redosSet([]));
}

function* redo() {
  const redos = yield select(selectors.getRedos);

  if (_.isEmpty(redos)) return;

  const allNotes = yield select(song.selectors.getActiveSequenceNotes);
  const undos = yield select(selectors.getUndos);

  yield put(actions.undosSet([
    ...undos,
    allNotes,
  ]));
  yield put(song.actions.notesSet(_.last(redos)));
  yield put(actions.redosSet(redos.slice(0, redos.length - 1)));
}

function* remove({ notes }) {
  yield put(song.actions.notesDeleted(notes));
}

function* removeSelected() {
  const selectedNotes = yield select(selectors.getSelectedNotes);
  yield put(actions.notesRemoved(selectedNotes));
}

function* resize({ notes, change }) {
  const measureCount = yield select(song.selectors.getActiveSequenceMeasureCount);
  const movingLeft = change.x < 0;
  const anyNoteBent = _.some(notes, n => (_.last(n.points).y - _.first(n.points).y) !== 0);
  const willBeMinLength = _.some(notes, n => (_.last(n.points).x - _.first(n.points).x) <= 1);
  const willBeNegative = _.some(notes, n => (_.last(n.points).x - _.first(n.points).x) <= 0);

  if (
    (movingLeft && anyNoteBent && willBeMinLength) ||
    (movingLeft && willBeNegative) ||
    (change.y !== 0 && _.some(notes, n => (_.last(n.points).x - _.first(n.points).x) === 0))
  ) return;

  const updatedNotes = notes
    .map(note => ({
      ...note,
      points: [
        ...note.points.slice(0, note.points.length - 1),
        helpers.addPoints(_.last(note.points), change),
      ],
    }));

  if (helpers.somePointOutside(_.map(updatedNotes, n => n.points[1]), measureCount)) return;

  yield put(playing.actions.notePreviewed(_.last(updatedNotes[0].points)));
  yield put(song.actions.notesUpdated(updatedNotes));
}

function* resizeSelected(action) {
  const selectedNotes = yield select(selectors.getSelectedNotes);
  const updatedNotes = selectedNotes.map(note => ({
    ...note,
    points: [
      ...note.points.slice(0, note.points.length - 1),
      {
        x: _.first(note.points).x + action.size - 1,
        y: _.first(note.points).y,
      },
    ],
  }));

  yield put(song.actions.notesUpdated(updatedNotes));
}

function* selectAll() {
  const notes = yield select(song.selectors.getActiveSequenceNotes);
  yield put(actions.notesSelected(notes));
}

function* shiftDownOctave() {
  const selectedNotes = yield select(selectors.getSelectedNotes);

  yield put(actions.notesMoved(selectedNotes, {
    x: 0,
    y: 12,
  }));
}

function* shiftUpOctave() {
  const selectedNotes = yield select(selectors.getSelectedNotes);

  yield put(actions.notesMoved(selectedNotes, {
    x: 0,
    y: -12,
  }));
}

function* undo() {
  const undos = yield select(selectors.getUndos);

  if (_.isEmpty(undos)) return;

  yield put(actions.redoPushed());
  yield put(song.actions.notesSet(_.last(undos)));
  yield put(actions.undosSet(undos.slice(0, undos.length - 1)));
}

export default function* saga() {
  yield [
    takeEvery([
      actionTypes.NOTE_DRAWN,
      actionTypes.NOTE_ERASED,
      actionTypes.NOTES_DUPLICATED,
      actionTypes.NOTES_REMOVED,
      actionTypes.SELECTED_NOTES_MOVED_OCTAVE_DOWN,
      actionTypes.SELECTED_NOTES_MOVED_OCTAVE_UP,
      actionTypes.SELECTED_NOTES_POSITION_NUDGED,
      actionTypes.SELECTED_NOTES_SIZE_NUDGED,
    ], pushUndo),
    takeEvery(actionTypes.ALL_NOTES_SELECTED, selectAll),
    takeEvery(actionTypes.NOTE_DRAWN, drawNote),
    takeEvery(actionTypes.NOTE_ERASED, erase),
    takeEvery(actionTypes.NOTES_DUPLICATED, duplicateNotes),
    takeEvery(actionTypes.NOTES_MOVED, moveNotes),
    takeEvery(actionTypes.NOTES_REMOVED, remove),
    takeEvery(actionTypes.NOTES_RESIZED, resize),
    takeEvery(actionTypes.REDO_POPPED, redo),
    takeEvery(actionTypes.REDO_PUSHED, pushRedo),
    takeEvery(actionTypes.SELECTED_NOTES_MOVED, moveSelected),
    takeEvery(actionTypes.SELECTED_NOTES_MOVED_OCTAVE_DOWN, shiftDownOctave),
    takeEvery(actionTypes.SELECTED_NOTES_MOVED_OCTAVE_UP, shiftUpOctave),
    takeEvery(actionTypes.SELECTED_NOTES_POSITION_NUDGED, nudgeSelectedNotesPosition),
    takeEvery(actionTypes.SELECTED_NOTES_REMOVED, removeSelected),
    takeEvery(actionTypes.SELECTED_NOTES_RESIZED, resizeSelected),
    takeEvery(actionTypes.SELECTED_NOTES_SIZE_CHANGED, changeSelectedNotesSize),
    takeEvery(actionTypes.SELECTED_NOTES_SIZE_NUDGED, nudgeSelectedNotesSize),
    takeEvery(actionTypes.UNDO_POPPED, undo),
    takeEvery(actionTypes.UNDO_PUSHED, pushUndo),
    takeEvery(shortcuts.actionTypes.REDO_PRESSED, redo),
    takeEvery(shortcuts.actionTypes.UNDO_PRESSED, undo),
  ];
}
