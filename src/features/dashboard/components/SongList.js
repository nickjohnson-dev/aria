import orderBy from 'lodash/fp/orderBy';
import PropTypes from 'prop-types';
import React from 'react';

import shared from '../../shared';
import SongListItem from './SongListItem';

const { Stack } = shared.components;

SongList.propTypes = {
  onDelete: PropTypes.func,
  onOpen: PropTypes.func,
  songs: PropTypes.object,
};

function SongList(props) {
  const { onDelete, onOpen, songs } = props;

  const sortedSongs = React.useMemo(
    () => orderBy((song) => song.dateModified, 'desc', Object.values(songs)),
    [songs],
  );

  return (
    <Stack
      isAnimated
      itemProps={{
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        initial: { opacity: 0 },
      }}
      space="medium"
    >
      {sortedSongs.map((song) => (
        <SongListItem
          key={song.id}
          onClick={onOpen}
          onDelete={onDelete}
          song={song}
        />
      ))}
    </Stack>
  );
}

export default React.memo(SongList);
