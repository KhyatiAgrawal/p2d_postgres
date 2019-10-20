import React, { Component } from 'react';
import './Favorites.scss';

import Navbar from '../../components/Navbar/Navbar';
import DressDisplay from '../../components/DressDisplay/DressDisplay';
import Grid from '../../components/Grid/Grid';

import dress1 from '../../styles/images/mock_dresses/key_dresses/01.jpg'
import dress2 from '../../styles/images/mock_dresses/key_dresses/01.jpg'
import dress3 from '../../styles/images/mock_dresses/key_dresses/01.jpg'

class Favorites extends Component {
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
    }
  }

	render() {
    return (
      <div className="fav__container">
        <div>
          <Navbar weight="heavy" />
        </div>
        <div className="fav-title">
          <div className="fav-title__text">{"My Favorites (" + this.state.total + ")"}</div>
        </div>
        <div className="fav-body">
          <div className="fav-dresses"><Grid images={this.state.dresses} /></div>
        </div>
      </div>
    );
  }
}

export default Favorites