import React from 'react';
import h from 'react-hyperscript';
import shared from '../../../shared';
import song from '../../../song';
import './sequencer-toolbar.scss';

const { IconButton, Toolbar } = shared.components;
const { DRAW, ERASE, PAN, SELECT } = shared.constants.toolTypes;

export class SequencerToolbar extends React.Component {
  static propTypes = {
    areSomeNotesSelected: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onDuplicate: React.PropTypes.func.isRequired,
    onOctaveDown: React.PropTypes.func.isRequired,
    onOctaveUp: React.PropTypes.func.isRequired,
    onToolSelect: React.PropTypes.func.isRequired,
    selectedNotes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    toolType: React.PropTypes.string.isRequired,
  }

  render() {
    return h(Toolbar, {
      className: 'sequencer-toolbar',
      isAlternate: this.props.areSomeNotesSelected,
      alternateLeftItems: [
        h(IconButton, {
          className: 'sequencer__toolbar__delete-button',
          icon: 'trash',
          onClick: this.handleDeleteButtonClick,
          toolTip: 'Delete',
        }),
        h(IconButton, {
          className: 'sequencer__toolbar__duplicate-button',
          icon: 'clone',
          onClick: this.handleDuplicateButtonClick,
          toolTip: 'Duplicate',
        }),
        h(IconButton, {
          className: 'sequencer__toolbar__octave-up-button',
          icon: 'arrow-up',
          onClick: this.handleOctaveUpButtonClick,
          toolTip: 'Octave up',
        }),
        h(IconButton, {
          className: 'sequencer__toolbar__octave-down-button',
          icon: 'arrow-down',
          onClick: this.handleOctaveDownButtonClick,
          toolTip: 'Octave down',
        }),
      ],
      alternateRightItems: [
        h(IconButton, {
          className: 'sequencer__toolbar__close-button',
          icon: 'close',
          onClick: this.props.onClose,
          toolTip: 'Back to tracks',
        }),
      ],
      leftItems: [
        h(IconButton, {
          className: 'sequencer__toolbar__select-tool-button',
          isActive: this.props.toolType === SELECT,
          icon: 'mouse-pointer',
          onClick: this.handleSelectToolButtonClick,
          toolTip: 'Select',
        }),
        h(IconButton, {
          className: 'sequencer__toolbar__draw-tool-button',
          isActive: this.props.toolType === DRAW,
          icon: 'pencil',
          onClick: this.handleDrawToolButtonClick,
          toolTip: 'Draw',
        }),
        h(IconButton, {
          className: 'sequencer__toolbar__erase-tool-button',
          isActive: this.props.toolType === ERASE,
          icon: 'eraser',
          onClick: this.handleEraseToolButtonClick,
          toolTip: 'Erase',
        }),
        h(IconButton, {
          className: 'sequencer__toolbar__pan-tool-button',
          isActive: this.props.toolType === PAN,
          icon: 'hand-paper-o',
          onClick: this.handlePanToolButtonClick,
          toolTip: 'Pan',
        }),
      ],
      rightItems: [
        h(IconButton, {
          className: 'sequencer__toolbar__close-button',
          icon: 'close',
          onClick: this.props.onClose,
          toolTip: 'Back to tracks',
        }),
      ],
    });
  }

  handleDeleteButtonClick = () => {
    this.props.onDelete({
      notes: this.props.selectedNotes,
    });
  }

  handleDuplicateButtonClick = () => {
    this.props.onDuplicate({
      notes: song.helpers.duplicateNotes(this.props.selectedNotes),
    });
  }

  handleOctaveDownButtonClick = () => {
    this.props.onOctaveDown({
      notes: this.props.selectedNotes,
    });
  }

  handleOctaveUpButtonClick = () => {
    this.props.onOctaveUp({
      notes: this.props.selectedNotes,
    });
  }

  handleDrawToolButtonClick = () => {
    this.props.onToolSelect({
      toolType: DRAW,
    });
  }

  handleEraseToolButtonClick = () => {
    this.props.onToolSelect({
      toolType: ERASE,
    });
  }

  handlePanToolButtonClick = () => {
    this.props.onToolSelect({
      toolType: PAN,
    });
  }

  handleSelectToolButtonClick = () => {
    this.props.onToolSelect({
      toolType: SELECT,
    });
  }
}
