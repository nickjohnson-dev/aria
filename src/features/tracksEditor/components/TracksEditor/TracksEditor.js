import Dawww from "dawww";
import find from "lodash/fp/find";
import isEmpty from "lodash/fp/isEmpty";
import isNil from "lodash/fp/isNil";
import PropTypes from "prop-types";
import React from "react";
import { HotKeys } from "react-hotkeys";
import styled from "styled-components/macro";
import shared from "../../../shared";
import { TrackList } from "../TrackList/TrackList";
import { TrackEditingModal } from "../TrackEditingModal/TrackEditingModal";
import { TracksEditorToolbar } from "../TracksEditorToolbar/TracksEditorToolbar";

const { Timeline } = shared.components;

const StyledTracksEditor = styled(HotKeys)({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative"
});

export class TracksEditor extends React.PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isRedoEnabled: PropTypes.bool.isRequired,
    isStopped: PropTypes.bool.isRequired,
    isUndoEnabled: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onPositionSet: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onSequenceAdd: PropTypes.func.isRequired,
    onSequenceDelete: PropTypes.func.isRequired,
    onSequenceDuplicate: PropTypes.func.isRequired,
    onSequenceEdit: PropTypes.func.isRequired,
    onSongMeasureCountChange: PropTypes.func.isRequired,
    onTrackAdd: PropTypes.func.isRequired,
    onTrackDelete: PropTypes.func.isRequired,
    onTrackIsMutedToggle: PropTypes.func.isRequired,
    onTrackIsSoloingToggle: PropTypes.func.isRequired,
    onTrackVoiceSet: PropTypes.func.isRequired,
    onTrackVolumeSet: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    position: PropTypes.number.isRequired,
    sequences: PropTypes.arrayOf(PropTypes.object).isRequired,
    song: PropTypes.object.isRequired,
    songMeasureCount: PropTypes.number.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  state = {
    selectedSequenceId: "",
    selectedTrackId: ""
  };

  constructor(props) {
    super(props);

    this.focusRef = React.createRef();
  }

  componentDidMount() {
    this.props.onLoad(this.props.match.params.songId);

    this.focusRef.current.focus();
  }

  render() {
    return (
      <StyledTracksEditor focused={true} handlers={this.getKeyHandlers()}>
        <div ref={this.focusRef} tabIndex={-1} />
        <React.Fragment>
          <TrackList
            isLoading={this.props.isLoading}
            isStopped={this.props.isStopped}
            onPositionSet={this.props.onPositionSet}
            onSequenceAdd={this.handleTrackListSequenceAdd}
            onSequenceDelete={this.props.onSequenceDelete}
            onSequenceEdit={this.props.onSequenceEdit}
            onSequenceDeselect={this.handleTrackListSequenceDeselect}
            onSequenceOpen={this.openSequence}
            onSequenceSelect={this.handleTrackListSequenceSelect}
            onSongMeasureCountChange={this.props.onSongMeasureCountChange}
            onTrackAdd={this.handleTrackListTrackAdd}
            onTrackIsMutedToggle={this.props.onTrackIsMutedToggle}
            onTrackIsSoloingToggle={this.props.onTrackIsSoloingToggle}
            onTrackStage={this.selectTrack}
            selectedSequence={this.getSelectedSequence()}
            songMeasureCount={this.props.songMeasureCount}
            tracks={this.props.tracks}
          />
          <TracksEditorToolbar
            isRedoEnabled={this.props.isRedoEnabled}
            isUndoEnabled={this.props.isUndoEnabled}
            onRedo={this.redo}
            onSequenceDelete={this.deleteSelectedSequence}
            onSequenceDuplicate={this.duplicateSelectedSequence}
            onSequenceOpen={this.openSequence}
            onUndo={this.undo}
            selectedSequence={this.getSelectedSequence()}
          />
          <Timeline
            isVisible={!this.props.isStopped}
            offset={this.props.position * 2 + 16}
          />
          <TrackEditingModal
            onDelete={this.deleteTrack}
            onDismiss={this.deselectTrack}
            onVoiceSet={this.props.onTrackVoiceSet}
            onVolumeSet={this.props.onTrackVolumeSet}
            stagedTrack={this.getSelectedTrack()}
          />
        </React.Fragment>
      </StyledTracksEditor>
    );
  }

  deleteSelectedSequence = e => {
    e.preventDefault();

    const selectedSequence = this.getSelectedSequence();

    if (isNil(selectedSequence)) return;

    this.props.onSequenceDelete(selectedSequence);
  };

  deleteTrack = track => {
    this.props.onTrackDelete(track);

    this.deselectTrack();
  };

  deselectTrack = () => {
    this.setState({
      selectedTrackId: ""
    });
  };

  duplicateSelectedSequence = e => {
    e.preventDefault();

    const selectedSequence = this.getSelectedSequence();

    if (isEmpty(selectedSequence)) return;

    const duplicatedSequence = Dawww.createSequence(
      selectedSequence.trackId,
      selectedSequence.position,
      selectedSequence.measureCount
    );

    this.props.onSequenceDuplicate(duplicatedSequence, selectedSequence);

    this.setState({
      selectedSequenceId: duplicatedSequence.id
    });
  };

  getKeyHandlers = () => ({
    backspace: this.deleteSelectedSequence,
    del: this.deleteSelectedSequence,
    "ctrl+shift+d": this.duplicateSelectedSequence,
    "ctrl+z": this.undo,
    "ctrl+alt+z": this.redo,
    "meta+shift+d": this.duplicateSelectedSequence,
    "meta+z": this.undo,
    "meta+alt+z": this.redo
  });

  getSelectedSequence = () =>
    find(s => s.id === this.state.selectedSequenceId, this.props.sequences) ||
    {};

  getSelectedTrack = () =>
    find(t => t.id === this.state.selectedTrackId, this.props.tracks) || {};

  handleTrackListSequenceAdd = (track, position) => {
    const sequence = Dawww.createSequence(track.id, position);

    this.props.onSequenceAdd(sequence);
  };

  handleTrackListSequenceDeselect = () => {
    this.setState({
      selectedSequenceId: ""
    });
  };

  handleTrackListSequenceSelect = sequence => {
    this.setState({
      selectedSequenceId: sequence.id
    });
  };

  handleTrackListTrackAdd = () => {
    const track = Dawww.createTrack();
    const sequence = Dawww.createSequence(track.id);

    this.props.onTrackAdd(track, sequence);
  };

  handleTracksEditorToolbarSequenceDelete = () => {
    this.props.onSequenceDelete(this.getSelectedSequence());
  };

  handleTracksEditorToolbarSequenceOpen = () => {
    this.openSequence(this.getSelectedSequence());
  };

  openSequence = sequence => {
    this.props.history.push(`${this.props.match.url}/sequencer/${sequence.id}`);
  };

  redo = () => {
    if (!this.props.isRedoEnabled) return;

    this.props.onRedo();
  };

  selectTrack = track => {
    this.setState({
      selectedTrackId: track.id
    });
  };

  undo = () => {
    if (!this.props.isUndoEnabled) return;

    this.props.onUndo();
  };
}