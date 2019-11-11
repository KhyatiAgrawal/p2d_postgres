import React, { Component } from 'react';

import './Modal.scss';
import x from '../../styles/svgs/black-cross.svg';
import plus_gray from '../../styles/svgs/plus-gray.svg';
import heart_gray from '../../styles/svgs/black-heart.svg';

class Modal extends Component {
  constructor(props) {
    super(props)
    let dresses = []
    for (var i = 0; i < props.image.total; i++) {
      dresses.push(props.image[i])
    }
    this.state = {
      dresses: dresses,
      selected: props.image.selected,
    }
  }

  changeSelection = (index) => {
    this.setState({
      selected: index,
    })
  }

  render() {
    return (
      <div>
        <div className='backdrop' onClick={this.props.onClick} />
        <div className='modal modal-container'>
          <img className='exit' src={x} alt='x' onClick={this.props.onClick} />
          <div className="modalimage-container">
            <div className="modalimage-container__thumbnail-container">
              {this.state.dresses.map((item, index) => (
                <img
                  className={"modalimage-container__thumbnail-img" + (index === this.state.selected ? " selected" : "")}
                  src={this.state.dresses[index]}
                  onClick={() => {this.changeSelection(index)}}
                />
              ))}
            </div>
            <img className="modalimage-container__main" src={this.props.image[this.state.selected]} />
            <div className="modalimage-container__text-container">
              <div className="modalimage-container__text"><b>{this.props.image.title}</b></div>
              <div><p className="dress-info">{this.props.image.description}</p></div>
              <div><p className="dress-info"><b>Our rental price: </b>${this.props.image.price}.00</p></div>
              <div className="dress-info"><b>Dress information:</b></div>
              <div className="dress-info">{"Size: " + this.props.image.size}</div>
              <div className="dress-info">{"Occasion: " + this.props.image.occasion.join(" ")}</div>
              <div className="dress-info">{"Brand: " + this.props.image.brand}</div>
              <div className="dress-info">{"Booked for: " + this.props.image.availability}</div>
              <div className="cart">
                <div className="circle-container">
                  <div className="circle">
                    <img src={plus_gray} className="cart__icon" />
                  </div>
                  <div className="circle-container__text">add to <br /> cart</div>
                </div>
                <div className="circle-container">
                  <div className="circle">
                    <img src={heart_gray} className="cart__icon" />
                  </div>
                  <div className="circle-container__text">add to <br /> favorites</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default Modal;
