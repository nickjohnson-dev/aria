import invokeArgs from 'lodash/fp/invokeArgs';

export function playNote(instrument, name, length = '16n', time?: string) {
  invokeArgs('triggerAttackRelease', [name, length, time], instrument);
}
