import React, { Component } from 'react';
import './Orders.scss';

import Navbar from '../../components/Navbar/Navbar';

class Orders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tryrequests: [],
			rentals: [],
		}
	}

	render() {
		return (
			<div className="Orders">
				<div><Navbar weight="heavy"/></div>
				<div className="orders-title__container">
					<div>
						<div className="orders-title__text">
							Try-on Requests
						</div>
						<div>{this.state.tryrequests.length === 0
							? "You have no try-on requests" : this.state.tryrequests.map((item, index) => (
								<div>Try Request {index}</div>
							))}
						</div>
					</div>
					<div>
						<div className="orders-title__text">
							Rentals
						</div>
						<div>{this.state.rentals.length === 0
							? "You have no rentals" : this.state.rentals.map((item, index) => (
								<div>Rental {index}</div>
							))}
						</div>
					</div>
				</div>
				<div>
				</div>
			</div>
		);
	}
}

export default Orders