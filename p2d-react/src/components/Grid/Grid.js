import React, { Component } from 'react';
import './Grid.scss';

class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: props.images || []
    }
  }

	render() {
    return (
      <div className="grid-container">
        <div className="wrapper">
        {this.state.images.map((item, index) => (
          <div className="image-container">
          </div>
        ))}
      </div>
      </div>
    );
  }
}

export default Grid