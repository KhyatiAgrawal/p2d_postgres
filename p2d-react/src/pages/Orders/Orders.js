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

	fetchHistory = async () => {
		let res;
		res = await axios.get(`${API_URL}/api/myOrders/`)
		let data1;
		let data2;
		console.log(res.data)
		data1 = res.data['pastHistory']
		data2 = res.data['upcomingHistory']
		let dress_data = []
		for (let i in data1) {
			dress_data.push({
				id: data1[i]['RentedDress']["id"],
				0: API_URL + "/" + data1[i]['RentedDress']["view1"],
				1: API_URL + "/" + data1[i]['RentedDress']["view2"],
				2: API_URL + "/" + data1[i]['RentedDress']["view3"],
				title: data1[i]['RentedDress']["title"],
				selected: 0,
				total: 3,
				brand: data1[i]['RentedDress']["brand"],
				size: data1[i]['RentedDress']["size"],
				description: data1[i]['RentedDress']["description"],
				occasion: data1[i]['RentedDress']["occasions"].split(/(\s+)/),
				price: data1[i]['RentedDress']["price"],
				availability: data1[i]['RentedDress']["unavailableDates"],
				dateRented: data1[i]['Date']
			})
		}
		if (this.mounted) {
			this.setState({oldrequests: dress_data})
		}
		dress_data = []
		for (let i in data2) {
			dress_data.push({
				id: data2[i]['RentedDress']["id"],
				0: API_URL + "/" + data2[i]['RentedDress']["view1"],
				1: API_URL + "/" + data2[i]['RentedDress']["view2"],
				2: API_URL + "/" + data2[i]['RentedDress']["view3"],
				title: data2[i]['RentedDress']["title"],
				selected: 0,
				total: 3,
				brand: data2[i]['RentedDress']["brand"],
				size: data2[i]['RentedDress']["size"],
				description: data2[i]['RentedDress']["description"],
				occasion: data2[i]['RentedDress']["occasions"].split(/(\s+)/),
				price: data2[i]['RentedDress']["price"],
				availability: data2[i]['RentedDress']["unavailableDates"],
				dateRented: data2[i]['Date']
			})
		}
		if (this.mounted) {
			this.setState({newrequests: dress_data})
		}

	}

	handleTotal = () => {
		console.log("handleTotal")
	}
	componentDidMount() {
    	this.mounted = true;
    	this.fetchHistory();
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
							Rental History
						</div>
						<div>{this.state.oldrequests.length === 0
							? "You have no past rentals" : this.state.oldrequests.map((item, index) => (
								<div>Try Request {index}</div>
							))}
						</div>
						<DressDisplay cart={true} handleTotal={this.handleTotal}/>
					</div>
					<div>
						<div className="orders-title__text">
							Upcoming Trials/Rentals
						</div>
						<div>{this.state.newrequests.length === 0
							? "You have no upcoming events" : this.state.newrequests.map((item, index) => (
								<div>Rental {index}</div>
							))}
						</div>
						<DressDisplay cart={true} handleTotal={this.handleTotal}/>
					</div>
				</div>
				<div>
				</div>
			</div>
		);
	}
}

export default Orders