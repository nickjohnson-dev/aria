import getOr from 'lodash/fp/getOr';

export const getNotes = getOr({}, 'song.present.notes');