import React from "react";
import ReactDOM from "react-dom";
import _, { endsWith, reject } from "lodash";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';


import 'bootstrap/dist/css/bootstrap.min.css';

import SoundfontProvider from "./SoundfontProvider";
import PianoWithRecording from "./PianoWithRecording";
import MusicPaper from "./MusicPaper";
import FileSaver from "file-saver";

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("b5")
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.BOTTOM_ROW.concat(KeyboardShortcuts.QWERTY_ROW)
});

let timeout_ret = "NONE"

class App extends React.Component {
  state = {
    recording: {
      mode: "RECORDING",
      events: [],
      currentTime: 0,
      currentEvents: [],
      startTime: Date.now(),
      last_push: 0,
      now_pushed: 0
    },
    selectedSound: "accordion",
    BPM: 120
  };

  constructor(props) {
    super(props);
    this.scheduledEvents = [];
    this.child = React.createRef();
    this.state.recording.events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : []
  }

  getRecordingEndTime = () => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map((event) => event.time + event.duration)
    );
  };

  setRecording = (value) => {
    this.setState({
      recording: Object.assign({}, this.state.recording, value)
    });
  };

  onClickPlay = () => {
    this.onClickStop()
    this.setRecording({
      mode: "PLAYING"
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, (event) => [
        event.time,
        event.time + event.duration
      ])
    );
    startAndEndTimes.forEach((time) => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter((event) => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents
          });
        }, time * 1000)
      );
    });
    // Stop at the end
    timeout_ret = setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    console.log(timeout_ret)
    if(timeout_ret !== "NONE"){
      clearTimeout(timeout_ret)
      timeout_ret = "NONE"
    }
    this.setRecording({
      mode: "RECORDING",
      currentEvents: []
    });
  };

  onClickClear = () => {
    localStorage.removeItem("events");
    const span = document.querySelector(".musicNotePrint");
    while (span.firstChild){
      span.removeChild(span.firstChild);
    }
    this.onClickStop();
    this.setRecording({
      events: [],
      mode: "RECORDING",
      currentEvents: [],
      currentTime: 0,
      last_push: 0,
      now_pushed: 0,
      startTime: Date.now()
    });
  };

  onClickSave = () => {
    const tmp = JSON.stringify(this.state.recording.events);
    const blob = new Blob([tmp]);
    FileSaver.saveAs(blob, "your_music_sheet.txt");
  };

  paintNote = (midiNumber, noteType) => {
    this.child.current.paintNote(midiNumber, noteType);
  }
  paintAllNoteOfInputFile = () => {
    let midiNumber, noteType;
    this.state.recording.events.map(item => {
      midiNumber = item.midiNumber;
      noteType = item.noteType;
      this.paintNote(midiNumber, noteType);
    });
  }
  onFileInput = async (e) => {
    e.preventDefault();
    this.onClickClear();

    const fr = new FileReader();
    fr.onload = async (e) => {
      const musicInString = (e.target.result);
      this.setState({
        ...this.state,
        recording: {
          ...this.state.recording,
          events: JSON.parse(musicInString)
        }
      });
      this.paintAllNoteOfInputFile();
      this.onClickPlay();
      localStorage.setItem("events", JSON.stringify(this.state.recording.events));
    };
    if (e.target.files[0]){
      fr.readAsText(e.target.files[0]);
    }
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      selectedSound: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert(`youve selected ${this.state.selectedSound}\nyour music BPM is ${this.state.BPM}`)
  }

  handleBPM = (e) => {
    this.setState({
      ...this.state,
      BPM: e.target.value
    })
  }

  render() {
    return (
      <div>
        <h1 className="title">
          <span className="emoji">🎹</span>
          Keyboard Piano
          <span className="emoji">🎹</span>
        </h1>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <label>
              &nbsp; &nbsp; &nbsp; Instrument: &nbsp; &nbsp;
              <select value={this.state.selectedSound} onChange={this.handleChange}>
                <option value="acoustic_grand_piano">acoustic_grand_piano</option>
                <option value="accordion">accordion</option>
                <option value="acoustic_bass">acoustic_bass</option>
                <option value="acoustic_guitar_nylon">acoustic_guitar_nylon</option>
                <option value="acoustic_guitar_steel">acoustic_guitar_steel</option>
                <option value="agogo">agogo</option>
                <option value="cello">cello</option>
                <option value="piccolo">piccolo</option>
                <option value="voice_oohs">voice_oohs</option>
                <option value="whistle">whistle</option>
              </select>
            </label>
            <label>
              &nbsp; &nbsp; &nbsp;BPM: &nbsp; &nbsp;
              <select value={this.state.BPM} onChange={this.handleBPM}>
                <option value="80">80</option>
                <option value="90">90</option>
                <option value="100">100</option>
                <option value="110">110</option>
                <option value="120">120</option>
                <option value="130">130</option>
                <option value="140">140</option>
                <option value="150">150</option>
                <option value="160">160</option>
                <option value="170">170</option>
              </select>
            </label>
          </Form>
        </div>

        <div className="mt-5">
          <div style={{margin: window.innerWidth*0.02}}>
            <SoundfontProvider
              instrumentName={this.state.selectedSound}
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <PianoWithRecording
                  ref={this.child}
                  recording={this.state.recording}
                  setRecording={this.setRecording}
                  noteRange={noteRange}
                  width={window.innerWidth*0.95}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  BPM={this.state.BPM}
                  keyboardShortcuts={keyboardShortcuts}
                />
              )}
            />
          </div>
        </div>
        <MusicPaper/>
        <div className="mt-5">
          <Button onClick={this.onClickPlay}>Play</Button>{' '}
          <Button onClick={this.onClickStop}>Stop</Button>{' '}
          <Button onClick={this.onClickClear}>Clear</Button>{' '}
          <Button onClick={this.onClickSave}>Save</Button>{' '}
          <Form>
            <Form.Row>
              <Col xs={4}>
                <Form.File
                  type="file"
                  onChange={this.onFileInput}
                />
              </Col>
            </Form.Row>
          </Form>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
