import PropTypes from 'prop-types';
import React from 'react';
import h from 'react-hyperscript';
import shared from '../../../shared';
import { Tracks } from '../tracks/tracks';
import { TrackerToolbar } from '../tracker-toolbar/tracker-toolbar';
import { TrackEditingModal } from '../track-editing-modal/track-editing-modal';
import './tracker.scss';

const { Timeline } = shared.components;
const { createSequence, createTrack } = shared.helpers;

export class Tracker extends React.PureComponent {
  static propTypes = {
    isStopped: PropTypes.bool.isRequired,
    onSequenceAdd: PropTypes.func.isRequired,
    onSequenceDelete: PropTypes.func.isRequired,
    onSequenceDeselect: PropTypes.func.isRequired,
    onSequenceExtend: PropTypes.func.isRequired,
    onSequenceMoveLeft: PropTypes.func.isRequired,
    onSequenceMoveRight: PropTypes.func.isRequired,
    onSequenceOpen: PropTypes.func.isRequired,
    onSequenceSelect: PropTypes.func.isRequired,
    onSequenceShorten: PropTypes.func.isRequired,
    onSongExtend: PropTypes.func.isRequired,
    onSongShorten: PropTypes.func.isRequired,
    onTrackAdd: PropTypes.func.isRequired,
    onTrackDelete: PropTypes.func.isRequired,
    onTrackEditingFinish: PropTypes.func.isRequired,
    onTrackIsMutedToggle: PropTypes.func.isRequired,
    onTrackIsSoloingToggle: PropTypes.func.isRequired,
    onTrackStage: PropTypes.func.isRequired,
    onTrackVoiceSet: PropTypes.func.isRequired,
    position: PropTypes.number.isRequired,
    selectedSequence: PropTypes.object.isRequired,
    selectedSequenceId: PropTypes.string.isRequired,
    songMeasureCount: PropTypes.number.isRequired,
    stagedTrack: PropTypes.object.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    return h('.tracker', [
      h(TrackerToolbar, {
        onSequenceDelete: this.handleTrackerToolbarSequenceDelete,
        onSequenceExtend: this.handleTrackerToolbarSequenceExtend,
        onSequenceMoveLeft: this.handleTrackerToolbarSequenceMoveLeft,
        onSequenceMoveRight: this.handleTrackerToolbarSequenceMoveRight,
        onSequenceOpen: this.handleTrackerToolbarSequenceOpen,
        onSequenceShorten: this.handleTrackerToolbarSequenceShorten,
        selectedSequence: this.props.selectedSequence,
      }),
      h(Tracks, {
        onSequenceAdd: this.handleTracksSequenceAdd,
        onSequenceDeselect: this.props.onSequenceDeselect,
        onSequenceOpen: this.handleTracksSequenceOpen,
        onSequenceSelect: this.handleTracksSequenceSelect,
        onSongExtend: this.props.onSongExtend,
        onSongShorten: this.props.onSongShorten,
        onTrackAdd: this.handleTracksTrackAdd,
        onTrackIsMutedToggle: this.handleTracksTrackIsMutedToggle,
        onTrackIsSoloingToggle: this.handleTracksTrackIsSoloingToggle,
        onTrackStage: this.handleTracksTrackStage,
        selectedSequenceId: this.props.selectedSequenceId,
        songMeasureCount: this.props.songMeasureCount,
        tracks: this.props.tracks,
      }),
      h(Timeline, {
        isVisible: !this.props.isStopped,
        offset: (this.props.position * 2) + 100,
      }),
      h(TrackEditingModal, {
        onDelete: this.handleTrackEditingModalDelete,
        onDismiss: this.props.onTrackEditingFinish,
        onVoiceSet: this.handleTrackEditingModalVoiceSet,
        stagedTrack: this.props.stagedTrack,
      }),
    ]);
  }

  handleTrackEditingModalDelete = (track, sequences) =>
    this.props.onTrackDelete({
      sequences,
      track,
    });

  handleTrackEditingModalVoiceSet = (track, voice) =>
    this.props.onTrackVoiceSet({
      track,
      voice,
    });

  handleTrackerToolbarSequenceDelete = () =>
    this.props.onSequenceDelete({
      sequence: this.props.selectedSequence,
    });

  handleTrackerToolbarSequenceExtend = () =>
    this.props.onSequenceExtend({
      sequence: this.props.selectedSequence,
    });

  handleTrackerToolbarSequenceMoveLeft = () =>
    this.props.onSequenceMoveLeft({
      sequence: this.props.selectedSequence,
    });

  handleTrackerToolbarSequenceMoveRight = () =>
    this.props.onSequenceMoveRight({
      sequence: this.props.selectedSequence,
    });

  handleTrackerToolbarSequenceOpen = () =>
    this.props.onSequenceOpen({
      sequence: this.props.selectedSequence,
    });

  handleTrackerToolbarSequenceShorten = () => {
    if (this.props.selectedSequence.measureCount < 2) return;
    this.props.onSequenceShorten({
      sequence: this.props.selectedSequence,
    });
  }

  handleTracksTrackAdd = () => {
    const track = createTrack();
    this.props.onTrackAdd({
      sequence: createSequence({
        trackId: track.id,
      }),
      track,
    });
  }

  handleTracksTrackIsMutedToggle = track =>
    this.props.onTrackIsMutedToggle({
      track,
    });

  handleTracksTrackIsSoloingToggle = track =>
    this.props.onTrackIsSoloingToggle({
      track,
    });

  handleTracksSequenceAdd = (track, position) =>
    this.props.onSequenceAdd({
      sequence: createSequence({
        trackId: track.id,
        position,
      }),
    });

  handleTracksSequenceOpen = sequence =>
    this.props.onSequenceOpen({
      sequence,
    });

  handleTracksSequenceSelect = sequence =>
    this.props.onSequenceSelect({
      sequence,
    });

  handleTracksTrackStage = track =>
    this.props.onTrackStage({
      track,
    });
}
