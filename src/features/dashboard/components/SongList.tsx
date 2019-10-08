import { AnimatePresence, motion } from 'framer-motion';
import orderBy from 'lodash/fp/orderBy';
import PropTypes from 'prop-types';
import React from 'react';
import createStyles from '@material-ui/styles/createStyles';
import withStyles from '@material-ui/styles/withStyles';
import SongListItem from './SongListItem';

const styles = theme =>
  createStyles({
    root: {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
  });

// TODO: Transition in songs in Song List to prevent duplicate entries on transition
function SongList(props) {
  const { classes, onDelete, onOpen, songs } = props;

  const sortedSongs = React.useMemo(
    () => orderBy(x => x.dateModified, 'desc', Object.values(songs)),
    [songs],
  );

  return (
    <div className={classes.root}>
      <AnimatePresence>
        {sortedSongs.map(song => (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={song.id}
          >
            <SongListItem onDelete={onDelete} onOpen={onOpen} song={song} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

SongList.propTypes = {
  onDelete: PropTypes.func,
  onOpen: PropTypes.func,
  songs: PropTypes.object,
};

export default React.memo(withStyles(styles)(SongList));