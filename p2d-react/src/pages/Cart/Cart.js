import React, { Component } from 'react';
import './Cart.scss';

import Navbar from '../../components/Navbar/Navbar';
import DressDisplay from '../../components/DressDisplay/DressDisplay';

import dress1 from '../../styles/images/mock_dresses/key_dresses/001.jpg'
import dress2 from '../../styles/images/mock_dresses/key_dresses/001.jpg'
import dress3 from '../../styles/images/mock_dresses/key_dresses/001.jpg'

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken"
const API_URL = 'https://localhost:8000';

class Cart extends Component {
  constructor(props) {
    super(props)

    let dresses = {}
    let amount = 0

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

  getAvailableTimes = async () => {
    let res = await axios.get(`${API_URL}/api/availableTimes/`)
    let times = res.data
    if (this.mounted) {
      this.setState({available_times: times})
    }
  }

  fetchDressesInCart = async () => {
    let res = await axios.get(`${API_URL}/api/cart/`)
    console.log(res.data)
    let dress_data = {}
    let amount = 0
    let total = 0
    for (let i in res.data) {
      dress_data[i] = {
        id: res.data[i]["id"],
        0: API_URL + "/" + res.data[i]["view1"],
        1: API_URL + "/" + res.data[i]["view2"],
        2: API_URL + "/" + res.data[i]["view3"],
        title: res.data[i]["title"],
        selected: 0,
        total: 3,
        brand: res.data[i]["brand"],
        size: res.data[i]["size"],
        description: res.data[i]["description"],
        occasion: res.data[i]["occasions"].split(/(\s+)/),
        price: res.data[i]["price"],
        availability: res.data[i]["unavailableDates"]
      }
      amount += parseInt(dress_data[i]["price"])
      total += 1
    }
    if (this.mounted) {
      this.setState({dresses: dress_data, amount: amount, total: total})
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.getAvailableTimes();
    this.fetchDressesInCart();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

	render() {
    console.log(this.state.available_times)
    return (
      <div className="cart__container">
        <div>
          <Navbar weight="heavy" />
        </div>
        <div className="cart-title">
          <div className="cart-title__text">{"My Cart (" + this.state.total + ")"}</div>
        </div>
        <div className="cart-body">
          <div className="cart-dresses"><DressDisplay dresses={this.state.dresses} cart={true} /></div>
          <div className="cart-summary" style={{maxHeight: this.state.total * 30 + 195}}>
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