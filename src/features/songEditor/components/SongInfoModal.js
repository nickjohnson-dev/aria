import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import map from 'lodash/fp/map';
import PropTypes from 'prop-types';
import React from 'react';
import { Translation } from 'react-i18next';

import Dawww from '../../../dawww';
import shared from '../../shared';

const { Button, FormGroup, Stack } = shared.components;
const { changeLanguage } = shared.i18n;
const getBPMRangeItem = (x) => ({ id: x, text: String(x) });
const bpmRangeItems = map(getBPMRangeItem, Dawww.BPM_RANGE);

SongInfoModal.propTypes = {
  isOpen: PropTypes.bool,
  onBPMChange: PropTypes.func,
  onConfirm: PropTypes.func,
  onReturnToDashboard: PropTypes.func,
  onSignOut: PropTypes.func,
  song: PropTypes.object,
};

function SongInfoModal(props) {
  const {
    isOpen,
    onBPMChange,
    onConfirm,
    onReturnToDashboard,
    onSignOut,
    song,
  } = props;

  const handleBPMSelectChange = React.useCallback(
    (e) => {
      onBPMChange(e.target.value);
    },
    [onBPMChange],
  );

  return (
    <Translation>
      {(t) => (
        <Dialog
          fullWidth={true}
          maxWidth="xs"
          onClose={onConfirm}
          open={isOpen}
        >
          <DialogTitle>{t('Song Info')}</DialogTitle>
          <DialogContent>
            <Stack space={4} sx={{ paddingBottom: 3 }}>
              <FormGroup label={t('Shareable Link')}>
                <a
                  href={`${process.env.PUBLIC_URL}/view-song/${song.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://ariaapp.io/view-song/{song.id}
                </a>
              </FormGroup>
              <FormGroup label={t('BPM')}>
                <select onChange={handleBPMSelectChange} value={song.bpm}>
                  {bpmRangeItems.map((bpmRangeItem) => (
                    <option key={bpmRangeItem.id} value={bpmRangeItem.id}>
                      {bpmRangeItem.text}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <Button onClick={onReturnToDashboard} variant="outlined">
                {t('Return to Dashboard')}
              </Button>
              <Button onClick={onSignOut} variant="outlined">
                {t('Sign Out')}
              </Button>
              <FormGroup label={t('Select Language')} space={4}>
                <Button onClick={() => changeLanguage('en')} variant="outlined">
                  {t('English')}
                </Button>
                <Button onClick={() => changeLanguage('jp')} variant="outlined">
                  {t('Japanese')}
                </Button>
              </FormGroup>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </Translation>
  );
}

export default React.memo(SongInfoModal);
