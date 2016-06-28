import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import Tone from 'tone';
import song from 'ducks/song';
import * as actions from './actions';
import * as actionTypes from './action-types';
import * as helpers from './helpers';
import * as selectors from './selectors';

function* addNewChannel({ track }) {
  const channel = helpers.createChannel(track);
  yield put(actions.addChannel(channel));
}

function* changeTrackInstrumentType({ synthType, track }) {
  const channel = yield select(selectors.getChannelById(track.id));

  if (channel.instrument.getType() !== synthType) {
    channel.instrument.setType(synthType);
  }
}

function* disposeInstruments({ channel }) {
  yield call(channel.instrument.dispose);
}

function* initialize(action) {
  const tracks = yield select(song.selectors.getTracks);

  yield setChannels({ tracks });

  yield setBPM({ bpm: action.song.bpm });
}

function* playNote({ payload }) {
  const { channelId, note, time } = payload;
  const channel = yield select(selectors.getChannelById(channelId));

  channel.instrument.playNote({ note, time });
}

function* previewNote({ name }) {
  const sequence = yield select(song.selectors.getActiveSequence);
  const channel = yield select(selectors.getChannelById(sequence.trackId));
  channel.instrument.previewNote(name);
}

function* receiveTrackUpdate({ track }) {
  const channelForTrack = yield select(selectors.getChannelById(track.id));

  if (channelForTrack.instrument.getType() !== track.synthType) {
    channelForTrack.instrument.setType(track.synthType);
  }
}

function* releaseAll() {
  const channels = yield select(selectors.getChannels);

  yield call(() => {
    channels.forEach(channel => {
      channel.instrument.release();
    });
  });
}

function* setBPM({ bpm }) {
  yield call(setToneBPM, bpm);
}

function* setChannels({ tracks }) {
  const previousChannels = yield select(selectors.getChannels);

  for (let i = 0; i < previousChannels.length; i++) {
    yield put(actions.instrumentDisposed(previousChannels[i]));
  }

  const channels = tracks.map(helpers.createChannel);

  yield put(actions.setChannels(channels));
}

export default function* saga() {
  yield [
    takeEvery(actionTypes.INSTRUMENT_DISPOSED, disposeInstruments),
    takeEvery(actionTypes.PLAY_NOTE, playNote),
    takeEvery(actionTypes.PREVIEW_NOTE, previewNote),
    takeEvery(actionTypes.RELEASE_ALL, releaseAll),
    takeEvery(song.actionTypes.ADD_NEW_TRACK, addNewChannel),
    takeEvery(song.actionTypes.LOAD_SONG, initialize),
    takeEvery(song.actionTypes.SET_BPM, setBPM),
    takeEvery(song.actionTypes.SET_TRACK_SYNTH_TYPE, changeTrackInstrumentType),
    takeEvery(song.actionTypes.SET_TRACKS, setChannels),
    takeEvery(song.actionTypes.UPDATE_TRACK, receiveTrackUpdate),
  ];
}

function setToneBPM(value) {
  Tone.Transport.bpm.value = value;
}
