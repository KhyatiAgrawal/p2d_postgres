import React, { Component } from 'react';
import './DressDisplay.scss';

class DressDisplay extends Component {
  constructor(props) {
    super(props)

    let dresses = {}
    for (var key in props.dresses) {
      dresses[key] = props.dresses[key]
      dresses[key].modal = false
      dresses[key].size = "Medium"
      dresses[key].brand = "Urban Outfitters"
      dresses[key].availability = "Available"
      dresses[key].occasion = "Lawnparties"
    }
    this.state = {
      dresses: dresses
    }
  }

	render() {
    return (
      <div className="dress-display">
        {
          Object.keys(this.props.dresses).map((key, index) => (
            <div className="dress-display__img-container">
              <img className="dress-display__img" src={this.state.dresses[index][0]} />
              <div className="dress-display__text">
                <div className="dress-display__title">{this.state.dresses[index].title}</div>
                <div><p>Our rental price: $15.00</p></div>
                <div>{"Size: " + this.state.dresses[index].size}</div>
                <div>{"Occasion: " + this.state.dresses[index].occasion}</div>
                <div>{"Brand: " + this.state.dresses[index].brand}</div>
                <div>{"Availability: " + this.state.dresses[index].availability}</div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default DressDisplay
