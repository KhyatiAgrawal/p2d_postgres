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
      pickedDate: false,
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

  totalHandler = (total, amount, dresses) => {
    if (this.mounted)
      this.setState({total: total, amount: amount, dresses: dresses})
  }

  getAvailableTimes = async () => {
    let res = await axios.get(`${API_URL}/api/availableTimes/`)
    let times = res.data
    if (this.mounted) {
      this.setState({available_times: times})
    }
  }

  checkAvailability = () => {
    this.setState({date_needed: document.getElementById("date-picker").value})
  }

  componentDidMount() {
    this.mounted = true;
    this.getAvailableTimes();
  }

  componentWillUnmount() {
    this.mounted = false;
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
          <div className="cart-dresses"><DressDisplay cart={true} handleTotal={this.totalHandler} date_needed={this.state.date_needed}/></div>
          <div className="cart-summary" style={{maxHeight: this.state.total * 30 + 195}}> 
          <div className="cart-summary__date">
            <div className="cart-summary__total" id="cart-date">When do you need these dresses?</div>
            <input className="cart-summary__pick-date" id="date-picker" type="date" />
            <div className="cart-summary__submit" onClick={this.checkAvailability}>
                Check availability
            </div>

          </div>
          {
            this.state.pickedDate ?
            <div>
              <div className="cart-summary__title">Your Try-On Request</div>
              <div className="cart-summary__items">
                {Object.keys(this.state.dresses).map((key, index) => (
                  <div className="cart-summary__item">
                    <div>{this.state.dresses[index].title}</div>
                    <div>${this.state.dresses[index].price}.00</div>
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
            : <div />
          }
          </div>
        </div>
      </div>
    );
  }
}

export default Cart