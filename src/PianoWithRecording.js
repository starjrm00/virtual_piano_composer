import React from "react";
import { Piano } from "react-piano";
import './styles/test.css';

// const DURATION_UNIT = 0.2;
// const DEFAULT_NOTE_DURATION = DURATION_UNIT;

class PianoWithRecording extends React.Component {
  static defaultProps = {
    notesRecorded: false
  };

  state = {
    keysDown: {},
    noteDuration: 2,
    notesRecorded: true,
    noteType: ""
  };

  setnoteType = duration => {
    if(duration >= 1.5){
      return "./img/Whole_note"
    }
    if(duration >= 0.75){
      return "./img/Half_note"
    }
    if(duration >= 0.375){
      return "./img/Quarter_note"
    }
    if(duration >= 0.1875){
      return "./img/Eighth_note"
    }
    return "./img/Sixteenth_note"
  }

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
      this.state.noteType = this.setnoteType(this.state.noteDuration);
      this.recordNotes(prevActiveNotes, this.state.noteDuration, this.state.noteType);
      this.setState({
        notesRecorded: true,
        //noteDuration: this.state.noteDuration
      });
    }
  };

  recordNotes = (midiNumbers, duration, noteType) => {
    if (this.props.recording.mode !== "RECORDING") {
      return;
    }
    const newEvents = midiNumbers.map((midiNumber) => {
      // img 태그로 일일이 음표 찍어주기
      let positionToBeDrawn; //STRING
      const text = document.querySelector(".musicNotePrint");
      const span = document.createElement("span");
      const img = new Image();
      img.src = require(noteType+".png");
      img.alt = "asdf";
      // if(/* 어쩌구면 */){
      //   img.classList.add(positionToBeDrawn);
      // }
      img.classList.add("sound_"+midiNumber)
      span.appendChild(img);
      text.appendChild(span);

      return {
        midiNumber,
        time: (this.props.recording.currentTime - this.props.recording.startTime)/1000,
        duration: duration,
        noteType: noteType,
        noteImg: noteType
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
