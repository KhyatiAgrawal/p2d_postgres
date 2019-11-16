import React, { Component } from 'react';
import './Favorites.scss';

import Navbar from '../../components/Navbar/Navbar';
import DressDisplay from '../../components/DressDisplay/DressDisplay';
import Grid from '../../components/Grid/Grid';

import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken"
const API_URL = 'https://localhost:8000';

class Favorites extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dresses: {},
      total: 0,
    }
  }

  fetchDressesInFavorites = async () => {
    let res = await axios.get(`${API_URL}/api/favorites/`)
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
    this.fetchDressesInFavorites();
  }

  componentWillUnmount() {
    this.mounted = false;
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
          <div className="fav-dresses"><DressDisplay favorites={true} dresses={this.state.dresses} /></div>
        </div>
      </div>
    );
  }
}

export default Favorites