import React, { Component } from 'react';
import { useLayoutEffect, useState } from 'react';
import './Account.scss';
import retrieveData from '../../components/retrieveData';

import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken"


const API_URL = 'https://localhost:8000';
const api_endpoint = new retrieveData();


class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			windowSize: window.innerWidth,
		}
	}

	handleResize = (e) => {
	    const windowSize = window.innerWidth;
	    this.setState(prevState => {
	      return {
	        windowSize
	      };
	    });
	 };

	fetchNumberRented = async (filters) => {
		let res;
		res = await axios.get(`${API_URL}/api/numberRented`)
		var newArr = [];
		var numOrders = res.data['numberRented']
		if (this.mounted) {
			for (let i = 0; i < numOrders; i++)
				newArr.push(true)
			this.setState({orders: newArr})
		}
	}


	componentDidMount() {
		this.mounted = true;
	    window.addEventListener("resize", this.handleResize);
	    this.fetchNumberRented();
	}

	componentWillUnmount() {
		this.mounted = false;
	    window.removeEventListener("resize", this.handleResize);
	}

	render() {
		const newWidth = this.state.windowSize * 0.75 * 0.1;
		const alpha = 0.2;
	    return (
	    	<div className="Account">
	    		<div><Navbar weight="heavy"/></div>
	    		<div className="account-title__container">
					<div className="account-title__text">My Sustainability Progress</div>
				</div>
				<div className="sus__container">
					<div className="sus__title">
						{"You've recycled " + this.state.orders.length + " dresses so far!"}
					</div>
					<div className="sus__outer-outer-bar">
						<div className="sus__outer-bar">
							{
								this.state.orders.map((item, index) => (
									<div className = "sus__inner-bar" style={{backgroundColor: `rgba(${148}, ${221}, ${217}, ${alpha + (index * 0.1)})`, width: newWidth}}/>
								))
							}
						</div>
					</div>
				</div>
				<div className="info__container">
					{
						this.state.orders.length === 0 ? <div className="info__stat">Rent a dress to minimize your carbon footprint! <br /> Each dress you reuse saves 3.53 lbs of carbon emissions :)</div>
						: <div className="info__stat">You've saved <b>{Math.round(3.53 * this.state.orders.length)} lbs</b> of carbon emissions</div>
					}
				</div>
	    	</div>

		);
	}
}

export default Account