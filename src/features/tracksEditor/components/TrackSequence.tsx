import classnames from 'classnames';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/styles/withStyles';
import React from 'react';
import TrackSequenceNote from './TrackSequenceNote';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: 64,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.primary.light,
      border: `2px solid ${theme.palette.background.paper}`,
      borderRadius: theme.shape.borderRadius * 2,
      overflow: 'hidden',
      position: 'relative',
      transition:
        'box-shadow 250ms ease, opacity 500ms ease, transform 150ms ease',
    },
    selected: {
      backgroundColor: theme.palette.primary.main,
    },
  });

interface Sequence {
  [key: string]: any;
}

export interface TrackSequenceProps extends WithStyles<typeof styles> {
  isDragging?: boolean;
  isSelected?: boolean;
  onOpen?: (sequence: Sequence) => void;
  onSelect?: (sequence: Sequence) => void;
  sequence: Sequence;
}

function TrackSequence(props: TrackSequenceProps) {
  const { classes, isSelected, onOpen, onSelect, sequence } = props;
  const handleClick = React.useCallback(() => {
    if (isSelected) return;

    onSelect(sequence);
  }, [isSelected, onSelect, sequence]);

  const handleDoubleClick = React.useCallback(() => {
    onOpen(sequence);
  }, [onOpen, sequence]);

  return (
    <div
      className={classnames(classes.root, { [classes.selected]: isSelected })}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {sequence.notes.map(note => (
        <TrackSequenceNote
          isSequenceSelected={isSelected}
          key={note.id}
          note={note}
        />
      ))}
    </div>
  );
}

export default React.memo(withStyles(styles)(TrackSequence));
