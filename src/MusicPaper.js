import React from "react";

class MusicPaper extends React.Component {

	render() {
		return (
			<div className="musicPaperContainer">
				<h3>Music Notes You've Entered</h3>
				<img className="treble-clef" src={require('./img/The_treble_clef.png')} alt='The treble clef' />
				<hr className="hr1"></hr>
				<hr className="hr2"></hr>
				<hr className="hr3"></hr>
				<hr className="hr4"></hr>
				<hr className="hr5"></hr>
				<span className="musicNotePrint"></span>
			</div>
		)
	}
}

export default MusicPaper;
