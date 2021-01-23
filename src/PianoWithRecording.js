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
      if(48 == midiNumber){
        img.className = "C3"
      } else if(49 === midiNumber){
        img.className = "CS3"
      } else if(50 === midiNumber){
        img.className = "D3"
      } else if(51 === midiNumber){
        img.className = "DS3"
      } else if(52 === midiNumber){
        img.className = "E3"
      } else if(53 === midiNumber){
        img.className = "F3"
      } else if(54 === midiNumber){
        img.className = "FS3"
      } else if(55 === midiNumber){
        img.className = "G3"
      } else if(56 === midiNumber){
        img.className = "GS3"
      } else if(57 === midiNumber){
        img.className = "A3"
      } else if(58 === midiNumber){
        img.className = "AS3"
      } else if(59 === midiNumber){
        img.className = "B3"
      } else if(60 === midiNumber){
        img.className = "C4"
      } else if(61 === midiNumber){
        img.className = "CS4"
      } else if(62 === midiNumber){
        img.className = "D4"
      } else if(63 === midiNumber){
        img.className = "DS4"
      } else if(64 === midiNumber){
        img.className = "E4"
      } else if(65 === midiNumber){
        img.className = "F4"
      } else if(66 === midiNumber){
        img.className = "FS4"
      } else if(67 === midiNumber){
        img.className = "G4"
      } else if(68 === midiNumber){
        img.className = "GS4"
      } else if(69 === midiNumber){
        img.className = "A4"
      } else if(70 === midiNumber){
        img.className = "AS4"
      } else if(71 === midiNumber){
        img.className = "B4"
      } else if(72 === midiNumber){
        img.className = "C5"
      } else if(73 === midiNumber){
        img.className = "CS5"
      } else if(74 === midiNumber){
        img.className = "D5"
      } else if(75 === midiNumber){
        img.className = "DS5"
      } else if(76 === midiNumber){
        img.className = "E5"
      } else if(77 === midiNumber){
        img.className = "F5"
      } else if(78 === midiNumber){
        img.className = "FS5"
      } else if(79 === midiNumber){
        img.className = "G5"
      } else if(80 === midiNumber){
        img.className = "GS5"
      } else if(81 === midiNumber){
        img.className = "A5"
      } else if(82 === midiNumber){
        img.className = "AS5"
      } else if(83 === midiNumber){
        img.className = "B5"
      }
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
