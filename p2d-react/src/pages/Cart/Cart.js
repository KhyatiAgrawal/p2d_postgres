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
    for (var i = 0; i < 32; i++) {
      dresses[i] = {
        0: dress1,
        1: dress2,
        2: dress3,
        title: 'Linen Midi Dress',
        selected: 0,
        total: 3,
      }
    }

    this.state = {
      dresses: dresses,
      total: Object.keys(dresses).length,
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
          <DressDisplay dresses={this.state.dresses} />
        </div>
      </div>
    );
  }
}

export default Cart