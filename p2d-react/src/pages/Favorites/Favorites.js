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

  totalHandler = (total) => {
    if (this.mounted)
      this.setState({total: total})
  }

  componentDidMount = () => {
    this.mounted = true;
  }

  componentWillUnmount = () => {
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
        <div className="fav-none" style={this.state.total === 0 ? {display: "flex"} : {display: "none"}}>
          <div className="fav-none__text">There are currently no items in your favorites.</div>
        </div>
        <div className="fav-body">
          <div className="fav-dresses"><DressDisplay handleTotal={this.totalHandler} favorites={true} /></div>
        </div>
      </div>
    );
  }
}

export default Favorites