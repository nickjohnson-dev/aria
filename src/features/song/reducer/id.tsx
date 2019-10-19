import { createSlice } from 'redux-starter-kit';
import shared from '../../shared';

const initialState = '';

export default createSlice({
  name: 'id',
  initialState,
  extraReducers: {
    [shared.actions.DASHBOARD_LOADED]: () => initialState,
    [shared.actions.SONG_LOADED]: (state, action) => action.payload.song.id,
  },
  reducers: {},
});
