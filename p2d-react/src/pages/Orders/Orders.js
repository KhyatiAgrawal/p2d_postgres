import React, { Component } from 'react';
import './Orders.scss';

import Navbar from '../../components/Navbar/Navbar';
import DressDisplay from '../../components/DressDisplay/DressDisplay';

import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken"

const API_URL = 'https://localhost:8000';

class Orders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			oldrequests: [],
			newrequests: [],
			trial_data: {},
			total: 0,
		}
	}

	handleTotal = (total) => {
		if (this.mounted)
			this.setState({total: total})
	}

	getTrials = async () => {
		let res = await axios.get(`${API_URL}/api/myOrders/`)
		res.data = res.data['trial']
		
		let trial_data = {}
		let date;
		let time;
		let total = 0;
		for (let i in res.data) {
			if (!date) date = res.data[i].date
			if (!time) time = res.data[i].time
			trial_data[i] = {
				title: res.data[i].title,
				price: res.data[i].price
			}
			total += 1;
		}
		if (this.mounted) {
			this.setState({
				date: date,
				time: time, 
				trial_data: trial_data,
				total: total,
			})
		}
	}

	deleteRequest = async () => {
		await axios.delete(`${API_URL}/api/alerts/`)
	}

	componentDidMount() {
		this.mounted = true;
		this.getTrials();
  	}

  	componentWillUnmount() {
    	this.mounted = false;
  	}

	render() {
		return (
			<div className="Orders">
				<div><Navbar weight="heavy"/></div>
				<div className="trials-container">
					<div className="trials-container__text">Upcoming Trials</div>
					<div style={this.state.total === 0 ? {display: "none"} : {display: "flex"}} className="trials-container__subcontainer">
						<div className="trials-container__subtext">Date: {this.state.date} | Time: {this.state.time}</div>
						<div className="trials-summary__items">
							{Object.keys(this.state.trial_data).map((key, index) => (
							<div className="trials-summary__item">
								<div>{this.state.trial_data[index].title}</div>
								<div>${this.state.trial_data[index].price}.00</div>
							</div>
							))}
						</div>
						<div className="delete" onClick={this.deleteRequest}>Cancel Try-On Request</div>
					</div>
				</div>
				<div className="orders-container">
					<div className="orders-title__container">
						<div>
							<div className="orders-title__text">
								Rental History ({this.state.total})
							</div>
							<div>{this.state.oldrequests.length === 0
								? "You have no past rentals" : this.state.oldrequests.map((item, index) => (
									<div>Try Request {index}</div>
								))}
							</div>
							<DressDisplay old_orders={true} handleTotal={this.handleTotal}/>
						</div>
						<div>
							<div className="orders-title__text">
								Upcoming Rentals ({this.state.total})
							</div>
							<div>{this.state.newrequests.length === 0
								? "You have no upcoming events" : this.state.newrequests.map((item, index) => (
									<div>Rental {index}</div>
								))}
							</div>
							<DressDisplay upcoming_orders={true} handleTotal={this.handleTotal}/>
						</div>
					</div>
					<div>
					</div>
				</div>
			</div>
		);
	}
}

export default Orders