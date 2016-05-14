import _ from 'lodash';
import notes from 'modules/notes';
import actionTypes from './action-types';
import * as selectors from './selectors';

export function resize(newPosition) {
  return (dispatch, getState) => {
    const previousPosition = selectors.getNewPosition(getState());

    if (!previousPosition) {
      dispatch(setNewPosition(newPosition));
      return;
    }

    if (_.isEqual(previousPosition, newPosition)) return;

    const selectedNotes = notes.selectors.getSelectedNotes(getState());
    const change = newPosition.x - previousPosition.x;

    dispatch(notes.actions.resize(
      selectedNotes,
      change
    ));

    dispatch(setNewPosition(newPosition));
  };
}

export function setIsResizing(isResizing) {
  return {
    type: actionTypes.SET_IS_RESIZING,
    isResizing,
  };
}

export function setNewPosition(newPosition) {
  return {
    type: actionTypes.SET_NEW_POSITION,
    newPosition,
  };
}

export function startResizing(startPosition) {
  return (dispatch, getState) => {
    dispatch(setIsResizing(true));
    dispatch(setNewPosition(startPosition));
    window.addEventListener('mouseup', () => {
      const isResizing = selectors.getIsResizing(getState());
      if (isResizing) {
        dispatch(stopResizing());
      }
    });
  };
}

export function stopResizing() {
  return (dispatch, getState) => {
    if (!selectors.getIsResizing(getState())) return;
    dispatch(setIsResizing(false));
    dispatch(setNewPosition(undefined));
  };
}
