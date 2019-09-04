import React, { Component } from 'react';
import './Grid.scss';

import arrow_left from '../../styles/svgs/side-arrow-left.svg'
import arrow_right from '../../styles/svgs/side-arrow-right.svg'

class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: props.images
    }
  }

  nextDress = (key, op) => {
    let images = this.state.images
    if (op === -1) {
      if (images[key].selected === 0) images[key].selected = images[key].total -1
      else images[key].selected = images[key].selected - 1
    } else {
      if (images[key].selected === images[key].total - 1) images[key].selected = 0
      else images[key].selected = images[key].selected + 1
    }
    this.setState({
      images: images
    })
  }

	render() {
    return (
      <div className="grid__container">
        <div className="wrapper">
        {Object.keys(this.state.images).map((key, index) => ( 
          <div className="dress-container">
            <div className="image-container">
              <img src={this.state.images[index][this.state.images[index]['selected']]} className="image-container__img"/>
              <div className='dress-overlay'>
                <img
                  src={arrow_left}
                  className="dress-overlay__arrow"
                  onClick={() => {this.nextDress(key, -1)}}
                />
                <img
                  src={arrow_right}
                  className="dress-overlay__arrow dress-overlay__right"
                  onClick={() => {this.nextDress(key, 1)}}
                />        
              </div>
            </div>
            <div className="dress-title">{this.state.images[index].title}</div>
            <div className="dress-rental"> Rental Price: $14.99 </div>
          </div>
        ))}
      </div>
      </div>
    );
  }
}

export default Grid