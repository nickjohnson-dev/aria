import _ from 'lodash';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import notes from 'ducks/notes';
import sequencing from 'ducks/sequencing';
import shared from 'ducks/shared';
import * as actions from './actions';
import * as actionTypes from './action-types';
import * as helpers from './helpers';
import * as selectors from './selectors';

function* start() {
  const startPoint = yield select(sequencing.selectors.getMousePoint);
  yield put(actions.setNewPoint(startPoint));
  //eslint-disable-next-line
  while(true) {
    yield call(shared.helpers.resolveOnMouseUp);
    const isResizing = yield select(selectors.getIsResizing);
    if (isResizing) {
      yield put(actions.stop());
    }
  }
}

function* update() {
  const newPoint = yield select(sequencing.selectors.getMousePoint);
  const previousPoint = yield select(selectors.getNewPoint);

  if (_.isEmpty(previousPoint)) {
    yield put(actions.setNewPoint(newPoint));
    return;
  }


  if (_.isEqual(previousPoint, newPoint)) return;

  const change = helpers.getPointOffset(previousPoint, newPoint);

  yield put(notes.actions.nudgeSelectedNotesSize(change));

  yield put(actions.setNewPoint(newPoint));
}

export default function* saga() {
  yield [
    takeEvery(actionTypes.START, start),
    takeEvery(actionTypes.UPDATE, update),
  ];
}