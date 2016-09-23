import _ from 'lodash';
import { NAME } from './constants';

const get = state => state[NAME];

export const getContextMenuItems = state => get(state).contextMenuItems;
export const getContextMenuPosition = state => get(state).contextMenuPosition;

export const getIsContextMenuOpen = state => !_.isEmpty(getContextMenuItems(state));