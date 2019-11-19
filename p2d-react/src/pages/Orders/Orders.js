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
		}
	}

	handleTotal = (total) => {
		if (this.mounted)
			this.setState({total: total})
	}
	componentDidMount() {
    	this.mounted = true;
  	}

  	componentWillUnmount() {
    	this.mounted = false;
  	}

	render() {
		return (
			<div className="Orders">
				<div><Navbar weight="heavy"/></div>
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
							Upcoming Trials/Rentals ({this.state.total})
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
		);
	}
}

export default Orders