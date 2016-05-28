import test from 'ava';
import * as constants from './constants';
import * as helpers from './helpers';

test('addPoints returns point with x values added and y values added', t => {
  const expected = {
    x: 24,
    y: 15,
  };
  const result = helpers.addPoints(
    { x: 16, y: 7 },
    { x: 8, y: 8 }
  );

  t.deepEqual(result, expected);
});

test('createNote returns properly formatted note', t => {
  const expected = {
    id: 1,
    points: [
      {
        x: 2,
        y: 35,
      },
      {
        x: 3,
        y: 35,
      },
    ],
  };
  const result = helpers.createNote({
    id: 1,
    points: [
      {
        x: 2,
        y: 35,
      },
      {
        x: 3,
        y: 35,
      },
    ],
  });

  t.deepEqual(result, expected);
});

test('getNoteName return correct note name when given Y position', t => {
  const expected = 'C3';
  const result = helpers.getNoteName(47);

  t.deepEqual(result, expected);
});

test('somePointOutside returns true if any point is at x < 0', t => {
  const measureCount = 1;
  const points = [{
    x: -1,
    y: 35,
  }];
  const result = helpers.somePointOutside(points, measureCount);

  t.truthy(result);
});

test('somePointOutside returns true if any point is at x > (measureCount * 8 * 4)', t => {
  const measureCount = 1;
  const points = [{
    x: measureCount * 8 * 4 + 1,
    y: 35,
  }];
  const result = helpers.somePointOutside(points, measureCount);

  t.truthy(result);
});

test('somePointOutside returns true if any point is at y < 0', t => {
  const measureCount = 1;
  const points = [{
    x: 35,
    y: -1,
  }];
  const result = helpers.somePointOutside(points, measureCount);

  t.truthy(result);
});

test('somePointOutside returns true if any point is at y > (constants.octaveRange.length * 12 - 1) and offset y=1', t => {
  const measureCount = 1;
  const points = [{
    x: 35,
    y: constants.octaveRange.length * 12,
  }];
  const result = helpers.somePointOutside(points, measureCount);

  t.truthy(result);
});