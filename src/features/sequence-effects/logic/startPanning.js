import { createLogic } from 'redux-logic';
import shared from '../../shared';
import shortcuts from '../../shortcuts';
import sequenceData from '../../sequence-data';

const { toolTypes } = shared.constants;

export const startPanning = createLogic({
  type: shortcuts.actions.PAN_HELD,
  process() {
    const toolType = '';
  },
});

// import { takeEvery } from 'redux-saga';
// import { put, select } from 'redux-saga/effects';
// import shared from '../shared';
// import shortcuts from '../shortcuts';
// import sequenceData from '../sequence-data';
//
// const { toolTypes } = shared.constants;
//
// function* startPanning() {
//   const toolType = yield select(sequenceData.selectors.getToolType);
//
//   yield put(sequenceData.actions.toolSelected({
//     toolType: toolTypes.PAN,
//     previousToolType: toolType,
//   }));
// }
//
// function* stopPanning() {
//   const previousToolType = yield select(sequenceData.selectors.getPreviousToolType);
//   const toolType = yield select(sequenceData.selectors.getToolType);
//
//   yield put(sequenceData.actions.toolSelected({
//     toolType: previousToolType,
//     previousToolType: toolType,
//   }));
// }
//
// export default function* saga() {
//   yield [
//     takeEvery(shortcuts.actions.PAN_HELD, startPanning),
//     takeEvery(shortcuts.actions.PAN_RELEASED, stopPanning),
//   ];
// }
