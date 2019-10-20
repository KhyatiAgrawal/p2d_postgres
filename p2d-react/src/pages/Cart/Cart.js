import React, { Component } from 'react';
import './Cart.scss';

import Navbar from '../../components/Navbar/Navbar';
import DressDisplay from '../../components/DressDisplay/DressDisplay';

import dress1 from '../../styles/images/mock_dresses/mockdress_1.jpeg'
import dress2 from '../../styles/images/mock_dresses/mockdress_2.jpeg'
import dress3 from '../../styles/images/mock_dresses/mockdress_3.jpeg'

class Cart extends Component {
  constructor(props) {
    super(props)

    let dresses = {}
    let amount = 0
    for (var i = 0; i < 10; i++) {
      dresses[i] = {
        0: dress1,
        1: dress2,
        2: dress3,
        price: "15.00",
        title: 'Linen Midi Dress',
        selected: 0,
        total: 3,
      }
      amount += parseInt(dresses[i].price)
    }

    this.state = {
      dresses: dresses,
      total: Object.keys(dresses).length,
      amount: amount,
      submitted: false,
    }
  }

  // work on this
  validateForm = () => {
    return true
  }

  toggleSubmitted = () => {
    if (!this.state.submitted && this.validateForm()) {
      this.setState({
        submitted: true
      })
    }
  }

	render() {
    return (
      <div className="cart__container">
        <div>
          <Navbar weight="heavy" />
        </div>
        <div className="cart-title">
          <div className="cart-title__text">{"My Cart (" + this.state.total + ")"}</div>
        </div>
        <div className="cart-body">
          <div className="cart-dresses"><DressDisplay dresses={this.state.dresses} /></div>
          <div className="cart-summary" style={{maxHeight: this.state.total * 46}}>
            <div className="cart-summary__title">Your Try-On Request</div>
            <div className="cart-summary__items">
              {Object.keys(this.state.dresses).map((key, index) => (
                <div className="cart-summary__item">
                  <div>{this.state.dresses[index].title}</div>
                  <div>{"$" + this.state.dresses[index].price}</div>
                </div>
              ))}
            </div>
            <div className="cart-summary__total" id="cart-date">Pick a date: <input type="date" /></div>
            <div className="cart-summary__total" id="cart-time">Pick a time: <input type="time" /></div>
            <div className="cart-summary__submit" onClick={this.toggleSubmitted} style={this.state.submitted ? {opacity: 0.7, pointer: 'default'} : {}}>
              Submit try-on request!
            </div>
            <div className="cart-summary__submitted" style={this.state.submitted ? {display: 'flex'} : {display: 'none'}}>
              Your request has been submitted - <br />we'll confirm your appointment shortly!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart