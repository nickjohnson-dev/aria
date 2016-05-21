import _ from 'lodash';
import notes from 'modules/notes';
import shared from 'modules/shared';
import sound from 'modules/sound';
import actionTypes from './action-types';
import * as helpers from './helpers';
import selectors from './selectors';

const { toolTypes } = shared.constants;

export function changeSynthType(synthType) {
  return (dispatch, getState) => {
    if (synthType === selectors.getSynthType(getState())) return;
    dispatch(setSynthType(synthType));
    dispatch(sound.actions.setSynth(synthType));
  };
}

export function panUpdate(elementRef, e) {
  return (dispatch, getState) => {
    const panStartPosition = selectors.getPanStartPosition(getState());
    helpers.panScrollContainer(elementRef, e, panStartPosition);
  };
}

export function setMousePosition(mousePosition) {
  return {
    type: actionTypes.SET_MOUSE_POSITION,
    mousePosition,
  };
}

export function setSynthType(synthType) {
  return {
    type: actionTypes.SET_SYNTH_TYPE,
    synthType,
  };
}

export function setToolType(toolType) {
  return (dispatch) => {
    if (_.includes([toolTypes.DRAW, toolTypes.ERASE], toolType)) {
      dispatch(notes.actions.selectNotes([]));
    }
    dispatch(setToolTypeInner(toolType));
  };
}

export function setToolTypeInner(toolType) {
  return {
    type: actionTypes.SET_TOOL_TYPE,
    toolType,
  };
}

export function updateMousePosition(mousePosition) {
  return (dispatch, getState) => {
    const prevMousePosition = selectors.getMousePosition(getState());

    if (_.isEqual(prevMousePosition, mousePosition)) return;

    dispatch(setMousePosition(mousePosition));
  };
}
