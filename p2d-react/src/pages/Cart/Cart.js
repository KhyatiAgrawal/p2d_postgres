import React, { Component } from 'react';
import './Cart.scss';

import Navbar from '../../components/Navbar/Navbar';
import DressDisplay from '../../components/DressDisplay/DressDisplay';

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

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

  toggleSubmitted = () => {
    if (!this.state.submitted) {
      this.setState({
        submitted: true
      })
    }
    let val = this.state.selected.split(" ")
    axios.put(`${API_URL}/api/alerts/`, 
      {'DateTime': val[0] + " " + val[1], 'RentalDate': this.state.date_needed, 'Dresses': [0, 1], 'PersonIncharge': val[2]})
  }

  totalHandler = (total, amount, dresses) => {
    if (this.mounted)
      this.setState({total: total, amount: amount, dresses: dresses})
  }

  getAvailableTimes = async () => {
    let res = await axios.get(`${API_URL}/api/availableTimes/`)
    let times = []
    for (let i in res.data) {
      times.push({"value": res.data[i]['DateTime'] + " " + res.data[i]["PersonIncharge"], "label": res.data[i]['DateTime']})
    }
    if (this.mounted) {
      this.setState({available_times: times})
    }
  }

  checkAvailability = () => {
    let d = new Date()
    var day = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();

    let selectedDate = document.getElementById("date-picker").value
    let isValid = false;

    if (selectedDate) {
      selectedDate = selectedDate.split("-")
      var month1 = parseInt(selectedDate[1])
      var day1 = parseInt(selectedDate[2])
      var year1 = parseInt(selectedDate[0])

      if (year1 === year && month1 >= month) {
        if (month1 === month && day1 > day + 2) {
          isValid = true
        } else if (month1 > month) {
          isValid = true
        }   
      }
    }
    if (isValid) {
      selectedDate = selectedDate[1] + "/" + selectedDate[2] + "/" + selectedDate[0]
      this.setState({date_needed: selectedDate, pickedDate: true})
    } else {
      this.setState({date_needed: undefined, pickedDate: false})
    }
  }

  _onSelect = (option) => {
    this.setState({selected: option.value})
  }

  componentDidMount() {
    this.mounted = true;
    this.getAvailableTimes();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

	render() {
    console.log(this.state.selected)
    const defaultOption = this.state.selected
    return (
      <div className="cart__container">
        <div>
          <Navbar weight="heavy" />
        </div>
        <div className="cart-title">
            <div className="cart-title__text">{"My Cart (" + this.state.total + ")"}</div>
        </div>
        <div className="cart-none" style={this.state.total === 0 ? {display: "flex"} : {display: "none"}}>
            <div className="cart-none__text">There are currently no items in your cart.</div>
        </div>
        <div className="cart-body">
          <div className="cart-dresses"><DressDisplay cart={true} handleTotal={this.totalHandler} date_needed={this.state.date_needed}/></div>
          <div className="cart-summary" style={{maxHeight: this.state.total * 30 + 195}}> 
          <div className="cart-summary__date" style={this.state.total === 0 ? {display: "none"} : {display: "block"}}>
            <div className="cart-summary__total" id="cart-date">When do you need these dresses?</div>
            <input className="cart-summary__pick-date" id="date-picker" type="date" />
            <div className="cart-summary__submit" onClick={this.checkAvailability}>
                Check availability
            </div>
            <div style={this.state.pickedDate ? {display: "none"} : {display: "block"}}>
              *We only accept try-on requests that are a minimum of three days from the current date.
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
              <div className="date-dropdown">
                <Dropdown id="dropdown" options={this.state.available_times} placeholder="Select a pickup time" onChange={this._onSelect} value={defaultOption}/>
              </div>
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