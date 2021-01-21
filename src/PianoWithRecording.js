import React from "react";
import { Piano } from "react-piano";

// const DURATION_UNIT = 0.2;
// const DEFAULT_NOTE_DURATION = DURATION_UNIT;

class PianoWithRecording extends React.Component {
  static defaultProps = {
    notesRecorded: false
  };

  state = {
    keysDown: {},
    noteDuration: 2,
    notesRecorded: true
  };

  onPlayNoteInput = (midiNumber) => {
    if(this.state.notesRecorded === true){
      console.log(midiNumber);
      this.setState({
        notesRecorded: false
      });
      this.props.recording.currentTime = Date.now()
    }
  };

  onStopNoteInput = (midiNumber, { prevActiveNotes }) => {
    if (this.state.notesRecorded === false) {
      
      this.state.noteDuration = (Date.now() - this.props.recording.currentTime)/1000
      this.recordNotes(prevActiveNotes, this.state.noteDuration);
      this.setState({
        notesRecorded: true,
        noteDuration: this.state.noteDuration
      });
    }
  };

  recordNotes = (midiNumbers, duration) => {
    if (this.props.recording.mode !== "RECORDING") {
      return;
    }
    const newEvents = midiNumbers.map((midiNumber) => {
      return {
        midiNumber,
        time: (this.props.recording.currentTime - this.props.recording.startTime)/1000,
        duration: duration
      };
    });
    this.props.setRecording({
      events: this.props.recording.events.concat(newEvents),
      currentTime: this.props.recording.currentTime + duration
    });
  };

  render() {
    const {
      playNote,
      stopNote,
      recording,
      setRecording,
      ...pianoProps
    } = this.props;

    const { mode, currentEvents } = this.props.recording;
    const activeNotes =
      mode === "PLAYING"
        ? currentEvents.map((event) => event.midiNumber)
        : null;
    return (
      <div>
        <Piano
          playNote={this.props.playNote}
          stopNote={this.props.stopNote}
          onPlayNoteInput={this.onPlayNoteInput}
          onStopNoteInput={this.onStopNoteInput}
          activeNotes={activeNotes}
          {...pianoProps}
        />
      </div>
    );
  }
}

export default PianoWithRecording;
