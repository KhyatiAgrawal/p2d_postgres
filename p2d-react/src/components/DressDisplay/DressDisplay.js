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
    this.state = {
      dresses: {},
    }
  }

  removeFromCart = async (id) => {
    await axios({method: 'delete', url: `${API_URL}/api/cart/`, data: {'dressToDelete': id}})
    if (this.props.cart)
      this.fetchDresses("cart");
    else
      this.fetchDresses("favorites");
  }

  removeFromFavorites = async (id) => {
    await axios({method: 'delete', url: `${API_URL}/api/favorites/`, data: {'dressToDelete': id}})
    if (this.props.cart)
      this.fetchDresses("cart");
    else
      this.fetchDresses("favorites");
  }

  componentWillReceiveProps = ({date_needed}) => {
    if (date_needed !== this.state.date_needed) {
      this.setState({date_needed: date_needed})
      this.fetchDresses("cart")
    }
  }

  fetchDresses = async (stem) => {
    let res;
    if (this.state.date_needed) {
      res = await axios.get(`${API_URL}/api/${stem}/`, {'rentalDate': this.state.date_needed})
    } else {
      if (stem === "old_orders") {
        res = await axios.get(`${API_URL}/api/myOrders/`)
        res.data = res.data['pastHistory']
      } else if (stem === "upcoming_orders") {
        res = await axios.get(`${API_URL}/api/myOrders/`)
        res.data = res.data['upcomingHistory']
      } else 
        res = await axios.get(`${API_URL}/api/${stem}/`)
    }
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
        availability: res.data[i]["unavailableDates"],
        dateRented: res.data[i]['Date'] || null
      }
      amount += parseInt(dress_data[i]["price"])
      total += 1
    }
    if (this.mounted) {
      this.setState({dresses: dress_data, amount: amount, total: total})
    }
    if (this.props.cart) {
      this.props.handleTotal(this.state.total, this.state.amount, this.state.dresses)
    } else {
      this.props.handleTotal(this.state.total)
    }
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.cart)
      this.fetchDresses("cart");
    else if (this.props.favorites)
      this.fetchDresses("favorites");
    else if (this.props.old_orders)
      this.fetchDresses("old_orders");
    else if (this.props.upcoming_orders)
      this.fetchDresses("upcoming_orders");
  }

  componentWillUnmount() {
    this.mounted = false;
  }

	render() {
    return (
      <div className="dress-display">
        {
          Object.keys(this.state.dresses).map((key, index) => (
            <div className="dress-display__img-container">
              <img className="dress-display__img" src={this.state.dresses[index][0]} />
              <div className="dress-display__text">
                <div className="dress-display__title">{this.state.dresses[index].title}</div>
                <div><p>Our rental price: ${this.state.dresses[index].price}.00</p></div>
                <div>{"Size: " + this.state.dresses[index].size}</div>
                <div>{"Occasion: " + this.state.dresses[index].occasion}</div>
                <div>{"Brand: " + this.state.dresses[index].brand}</div>
                <div>{(this.props.old_orders || this.props.upcoming_orders) ? "Date: " + this.state.dresses[index].dateRented : ""}</div>
                <div className="cart-button" style={this.props.cart ? { display: 'flex'} : {display: 'none'}} onClick={() => {this.removeFromCart(this.state.dresses[index].id)}}>
                  <div className="cart-button__content">Remove from cart</div>
                </div>
                <div className="cart-button" style={this.props.favorites ? { display: 'flex'} : {display: 'none'}} onClick={() => {this.removeFromFavorites(this.state.dresses[index].id)}}>
                  <div className="cart-button__content">Remove</div>
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
