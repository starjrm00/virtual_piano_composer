import React from "react";

class MusicPaper extends React.Component {
	render() {
		return (
			<div>
				<br></br>
				<h3>&nbsp;&nbsp;Music Notes You've Entered</h3>
				<div className="musicPaperContainer">
					<div className="five-lines">
						<img className="treble-clef" src={require('./img/The_treble_clef.png')} alt='The treble clef' />
						<span className="musicNotePrint"></span>
						<hr></hr>
						<hr></hr>
						<hr></hr>
						<hr></hr>
						<hr></hr>
					</div>
				</div>
			</div>
		)
	}
}

export default MusicPaper;
