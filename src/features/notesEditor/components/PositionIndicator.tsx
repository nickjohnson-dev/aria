import styled from '@emotion/styled';
import { transparentize } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';

const Column = styled.div(({ theme }) => ({
  backgroundColor: transparentize(0.9, theme.palette.primary.main),
  borderRadius: theme.shape.borderRadius,
  bottom: 0,
  left: 6,
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  width: 28,
}));

const Row = styled.div(({ theme }) => ({
  backgroundColor: transparentize(0.9, theme.palette.primary.main),
  borderRadius: theme.shape.borderRadius,
  left: 0,
  height: 28,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 6,
}));

PositionIndicator.propTypes = {
  mousePoint: PropTypes.object,
};

function PositionIndicator(props) {
  const { mousePoint } = props;

  return (
    <React.Fragment>
      {mousePoint.x >= 0 && (
        <Column
          style={{
            transform: `translateX(${mousePoint.x * 40}px)`,
          }}
        />
      )}
      {mousePoint.y >= 0 && (
        <Row
          style={{
            transform: `translateY(${mousePoint.y * 40}px)`,
          }}
        />
      )}
    </React.Fragment>
  );
}

export default React.memo(PositionIndicator);