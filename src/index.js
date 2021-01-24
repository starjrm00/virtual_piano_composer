import React from "react";
import ReactDOM from "react-dom";
import _, { endsWith } from "lodash";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";

import SoundfontProvider from "./SoundfontProvider";
import PianoWithRecording from "./PianoWithRecording";
import MusicPaper from "./MusicPaper";

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

class App extends React.Component {
  state = {
    recording: {
      mode: "RECORDING",
      events: [],
      currentTime: 0,
      currentEvents: [],
      startTime: Date.now(),
      selectedSound: ""
    }
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
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
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      mode: "RECORDING",
      currentEvents: []
    });
  };

  onClickClear = () => {
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
      startTime: Date.now()
    });
  };

  handleChange = (e) => {
    this.setState({
      ...this.state,
      selectedSound: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert(`youve selected ${this.state.selectedSound}`)
  }

  render() {
    return (
      <div>
        <h1 className="h3">react-piano recording + playback demo</h1>
          
        <form onSubmit={this.handleSubmit}>
          <label>
            Pick your sound: 
            <select value={this.state.selectedSound} onChange={this.handleChange}>
              <option value="">--Please choose an option--</option>
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
          <input type="submit" value="Submit" />
        </form>

        <div className="mt-5">
          <SoundfontProvider
            instrumentName={this.state.selectedSound}
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
              <PianoWithRecording
                recording={this.state.recording}
                setRecording={this.setRecording}
                noteRange={noteRange}
                width={300}
                playNote={playNote}
                stopNote={stopNote}
                disabled={isLoading}
                keyboardShortcuts={keyboardShortcuts}
              />
            )}
          />
        </div>
        <MusicPaper/>
        <div className="mt-5">
          <button onClick={this.onClickPlay}>Play</button>
          <button onClick={this.onClickStop}>Stop</button>
          <button onClick={this.onClickClear}>Clear</button>
        </div>
        <div className="mt-5">
          <strong>Recorded notes</strong>
          <div>{JSON.stringify(this.state.recording.events)}</div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
