import _ from 'lodash';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import Mousetrap from 'mousetrap';
// import notes from 'ducks/notes';
import sequencing from 'ducks/sequencing';
import shared from 'ducks/shared';
import transport from 'ducks/transport';
import * as actions from './actions';
import * as actionTypes from './action-types';
import * as selectors from './selectors';

const shortcuts = [
  // Notes
  // [notes.actions.allNotesDeselected(), ['ctrl+d', 'meta+d']],
  // [notes.actions.allNotesSelecte(), ['ctrl+a', 'meta+a']],
  // [notes.actions.notesDuplicated(), ['ctrl+shift+d', 'meta+shift+d']],
  // [notes.actions.redoPopped(), ['ctrl+y', 'meta+y']],
  // [notes.actions.selectedNotesPositionNudged({ x: 0, y: -1 }), ['up']],
  // [notes.actions.selectedNotesPositionNudged({ x: 0, y: 1 }), ['down']],
  // [notes.actions.selectedNotesPositionNudged({ x: -1, y: 0 }), ['left']],
  // [notes.actions.selectedNotesPositionNudged({ x: 1, y: 0 }), ['right']],
  // [notes.actions.selectedNotesSizeNudged({ x: 0, y: -1 }), ['ctrl+up', 'meta+up']],
  // [notes.actions.selectedNotesSizeNudged({ x: 1, y: 0 }), ['ctrl+right', 'meta+right']],
  // [notes.actions.selectedNotesSizeNudged({ x: 0, y: 1 }), ['ctrl+down', 'meta+down']],
  // [notes.actions.selectedNotesSizeNudged({ x: -1, y: 0 }), ['ctrl+left', 'meta+left']],
  // [notes.actions.selectedNotesRemoved(), ['backspace', 'del']],
  // [notes.actions.selectedNotesResized(1), ['ctrl+1', 'meta+1']],
  // [notes.actions.selectedNotesResized(2), ['ctrl+2', 'meta+2']],
  // [notes.actions.selectedNotesResized(4), ['ctrl+3', 'meta+3']],
  // [notes.actions.selectedNotesResized(8), ['ctrl+4', 'meta+4']],
  [{ type: actionTypes.REDO }, ['ctrl+y', 'meta+y']],
  [{ type: actionTypes.UNDO }, ['ctrl+z', 'meta+z']],

  // Playback
  [transport.actions.playbackStopped(), ['escape']],
  [transport.actions.playbackToggled(), ['enter']],

  // Tools
  [actions.activateTool(shared.constants.toolTypes.DRAW), ['d']],
  [actions.activateTool(shared.constants.toolTypes.ERASE), ['e']],
  [actions.activateTool(shared.constants.toolTypes.MOVE), ['m']],
  [actions.activateTool(shared.constants.toolTypes.PAN), ['p']],
  [actions.activateTool(shared.constants.toolTypes.SELECT), ['s']],
];

function* activateTool({ toolType }) {
  const currentToolType = yield select(sequencing.selectors.getToolType);

  if (currentToolType === toolType) return;

  yield put(sequencing.actions.selectTool(toolType));
}

function* holdPan({ e }) {
  e.preventDefault();
  const heldKeys = yield select(selectors.getHeldKeys);

  if (_.includes(heldKeys, e.keyCode)) return;

  const toolType = shared.constants.toolTypes.PAN;
  const currentToolType = yield select(sequencing.selectors.getToolType);

  if (currentToolType === toolType) return;

  yield put(sequencing.actions.selectTool(toolType));
  yield put(actions.setHeldKeys([e.keyCode]));
}

function* initialize() {
  yield put(actions.registerShortcuts(shortcuts));

  //eslint-disable-next-line
  while (true) {
    const action = yield call(resolveOnShortcut);
    yield put(action);
  }
}

function* releasePan() {
  const previousToolType = yield select(sequencing.selectors.getPreviousToolType);

  if (!previousToolType || previousToolType === shared.constants.toolTypes.PAN) return;

  yield put(sequencing.actions.selectTool(previousToolType));
  yield put(actions.setHeldKeys([]));
}

export default function* saga() {
  yield [
    takeEvery(actionTypes.ACTIVATE_TOOL, activateTool),
    takeEvery(actionTypes.HOLD_PAN, holdPan),
    takeEvery(actionTypes.RELEASE_PAN, releasePan),
    takeEvery(actionTypes.INITIALIZED, initialize),
  ];
}

function resolveOnShortcut() {
  return new Promise(resolve => {
    // Held Keys
    Mousetrap.bind('space', (e) => resolve(actions.holdPan(e)), 'keydown');
    Mousetrap.bind('space', () => resolve(actions.releasePan()), 'keyup');
  });
}
