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
          <div className="dress-container">
            <div className="image-container"></div>
            <div className="dress-title"> Dress Title </div>
            <div className="dress-retail"> Retail Price: $59.99 </div>
            <div className="dress-rental"> Our Rental Price: $14.99 </div>
          </div>
        ))}
      </div>
      </div>
    );
  }
}

export default Grid