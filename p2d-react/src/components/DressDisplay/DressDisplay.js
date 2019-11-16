import React, { Component } from 'react';
import './DressDisplay.scss';

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken"
const API_URL = 'https://localhost:8000';

class DressDisplay extends Component {
  constructor(props) {
    super(props)
    let dresses = {}
    for (var key in props.dresses) {
      dresses[key] = props.dresses[key]
      dresses[key].modal = false
      dresses[key].size = props.dresses[key].size
      dresses[key].brand = props.dresses[key].brand
      dresses[key].availability = props.dresses[key].availability
      dresses[key].occasion = props.dresses[key].occasion
    }
    this.state = {
      dresses: dresses,
    }
  }

  componentWillReceiveProps({dresses}) {
    let dress_data = {}
    for (let i in dresses) {
      dress_data[i] = {
        ...dresses[i],
        modal: false
      }
    }
    this.setState({
      dresses: dress_data,
    })
  }

  removeFromCart = (id) => {
    axios({method: 'delete', url: `${API_URL}/api/cart/`, data: {'dressToDelete': id}})
    // axios.delete(`${API_URL}/api/cart/`, {'dressToDelete': id})
  }

  removeFromFavorites = (id) => {
    axios({method: 'delete', url: `${API_URL}/api/favorites/`, data: {'dressToDelete': id}})
    // axios.delete(`${API_URL}/api/cart/`, {'dressToDelete': id})
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
                <div className="cart-button" style={this.props.cart ? { display: 'flex'} : {display: 'none'}} onClick={() => {this.removeFromCart(this.state.dresses[index].id)}}>
                  <div className="cart-button__content">Remove from cart</div>
                </div>
                <div className="cart-button" style={this.props.favorites ? { display: 'flex'} : {display: 'none'}} onClick={() => {this.removeFromFavorites(this.state.dresses[index].id)}}>
                  <div className="cart-button__content">Remove from favorites</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default DressDisplay
