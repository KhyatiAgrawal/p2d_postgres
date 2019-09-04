import React, { Component } from 'react';

import './Modal.scss';
import x from '../../styles/svgs/black-cross.svg';

class Modal extends Component {
  constructor(props) {
    super(props)

    let dresses = []
    for (var i = 0; i < props.image.total; i++) {
      dresses.push(props.image[i])
    }

    this.state = {
      dresses: dresses
    }
  }

  render() {
    console.log(this.state.dresses)
    return (
      <div>
        <div className='backdrop' onClick={this.props.onClick} />
        <div className='modal modal-container'>
          <img className='exit' src={x} alt='x' onClick={this.props.onClick} />
          <div className="image-container">
            <div className="image-container__thumbnail-container">
              {this.state.dresses.map((item, index) => (
                <img className="image-container__thumbnail-img" src={this.state.dresses[index]} />
              ))}
            </div>
            <img className="image-container__main" src={this.props.image[this.props.image.selected]} />
            <div className="image-container__text-container">
              <div className="image-container__text">{this.props.image.title}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default Modal;
