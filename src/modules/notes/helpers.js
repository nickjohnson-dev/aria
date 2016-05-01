import _ from 'lodash';
import sound from 'modules/sound';

export function addPositions(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function createNote({ id, position }) {
  return {
    id: id || _.uniqueId('note'),
    name: sound.helpers.getNoteName(position.y),
    position,
  };
}

export function getMousePosition(el, pageX, pageY) {
  const offsetLeft = el.parentElement.parentElement.offsetLeft;
  const offsetTop = el.parentElement.parentElement.offsetTop;
  const scrollTop = el.parentElement
    .parentElement
    .parentElement
    .parentElement
    .scrollTop;
  const toSlotNumber = num => Math.floor(num / 40);
  return {
    x: toSlotNumber(pageX - offsetLeft),
    y: toSlotNumber(pageY - offsetTop + scrollTop),
  };
}

export function getPositionOffset(start, end) {
  return {
    x: end.x - start.x,
    y: end.y - start.y,
  };
}
