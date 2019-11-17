import React from 'react';
import './feed.scss';

import Navbar from '../../components/Navbar/Navbar';
import Grid from '../../components/Grid/Grid';
import retrieveData from '../../components/retrieveData';

import hamburger_green from '../../styles/svgs/landing_page/hamburger-green.svg'
import cross from '../../styles/svgs/cross.svg'
import plus from '../../styles/svgs/plus.svg'
import minus from '../../styles/svgs/minus.svg'
import black_heart from '../../styles/svgs/black-heart.svg'
import left_arrow from '../../styles/svgs/left-arrow.svg'

import axios from 'axios';
import Cookies from 'js-cookie';

// Setting axios options

// axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
// axios.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'https://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken"

const API_URL = 'https://localhost:8000';
const api_endpoint = new retrieveData();

// let _csrfToken = null;

// async function getCsrfToken() {
//   if (_csrfToken === null) {
//     const response = await fetch(`${API_URL}/csrf/`, {
//       credentials: 'include',
//     });
//     const data = await response.json();
//     _csrfToken = data.csrfToken;
//   }
//   return _csrfToken;
// }

class Feed extends React.Component {
	constructor(props) {
		super(props)

		this.fetchDresses = this.fetchDresses.bind(this)
		let storedItems = JSON.parse(localStorage.getItem('state'))
		this.state = {
			dresses: [],
			searchFilters: storedItems ? storedItems['searchFilters'] : [],
			filters: [],
			searchFilters: [],
			activeFilters: storedItems ? storedItems['activeFilters'] : new Array(0).fill(false),
			showSidebar: storedItems ? storedItems['showSidebar'] : true,
			showFilters: {
				occasion: storedItems ? storedItems['showFilters']['occasion'] : false,
				size: storedItems ? storedItems['showFilters']['size'] : false,
				max_price: storedItems ? storedItems['showFilters']['max_price'] : false,
				availability: storedItems ? storedItems['showFilters']['availability'] : false,
				keyword: storedItems ? storedItems['showFilters']['keyword'] : false,
			}
		}
	}

	fetchDresses = async (filters) => {
		let clusteredFilters = this.clusterFilters(filters)
		let res;
		if (filters && filters.length > 0) {
			res = await axios({method: 'post', url: `${API_URL}/api/feed/`, data: clusteredFilters})
		} else {
			res = await axios.get(`${API_URL}/api/feed/`)
		}
		let dress_data = []
		for (let i in res.data) {
			dress_data.push({
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
			})
		}
		if (this.mounted) {
			this.setState({dresses: dress_data})
		}
	}

	clusterFilters = (filters) => {
		let cluster = {}
		for (let i in filters) {
			let key = Object.keys(filters[i])[0]
			if (cluster[key]) {
				cluster[key].push(filters[i][key])
			} else {
				cluster[key] = [filters[i][key]]
			}
		}
		return cluster
	}

	componentDidMount() {
		this.mounted = true;
		this.fetchDresses();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	toggleFilter = (index) => {
		let newFilters = this.state.filters.slice()
		let newSearchFilters = this.state.searchFilters.slice()
		let newActiveFilters = this.state.activeFilters.slice()
		newActiveFilters[index] = newActiveFilters[index]
		newFilters = (newFilters.slice(0, index)).concat(newFilters.slice(index+1, newFilters.length))
		newSearchFilters = (newSearchFilters.slice(0, index)).concat(newSearchFilters.slice(index+1, newSearchFilters.length))
	
		this.setState({
			filters: newFilters,
			activeFilters: newActiveFilters,
			searchFilters: newSearchFilters
		})

		this.fetchDresses(newSearchFilters);
	}

	toggleMenu = () => {
		this.setState({
			showSidebar: !this.state.showSidebar,
		})
	}

	toggleFilterDisplay = (filter) => {
		let newShowFilters = {}
		Object.assign(newShowFilters, this.state.showFilters);
		newShowFilters[filter] = !newShowFilters[filter]

		this.setState({
			showFilters: newShowFilters,
		})
	}

	addFilter = (type, filter, price) => {
		let newFilters = this.state.filters.slice()
		let newSearchFilters = this.state.searchFilters.slice()
		let newActiveFilters = this.state.activeFilters.slice()

		newFilters.unshift(filter)
		newActiveFilters.unshift(true)

		if (type === "price") {
			newSearchFilters.unshift({"price": price})
		} else {
			newSearchFilters.unshift({[type]: filter})
		}

		this.setState({
			filters: newFilters,
			activeFilters: newActiveFilters,
			searchFilters: newSearchFilters
		})
		this.fetchDresses(newSearchFilters);
	}

	render() {
		console.log(this.state.dresses)
		localStorage.setItem('state', JSON.stringify(this.state))
		return (
			<div className="Feed">
				<div><Navbar weight="heavy"/></div>
				<div className="feed-title__container">
					<div className="feed-title__text">Explore our custom inventory</div>
					<img src={black_heart} className="feed-title__img" />
				</div>
				<div className="filter-container">
					<div className="filter-container__item" onClick={this.toggleMenu}>
						<img src={hamburger_green} className="filter-img" />
						<div>{this.state.showSidebar ? "hide filters" : "show filters"}</div>
					</div>
					<div className="filter-content__container" >
						{(this.state.filters.length === 0) 
							? <div className="empty-filter">
									<img className="empty-filter__img" src={left_arrow} />
									select filters from the sidebar!
								</div>
							: this.state.filters.map((item, index) => (
              <div className="filter-content__item">
								<div className="filter-content__text">{this.state.filters[index]}</div>
								<img src={cross} className="filter-content__img" onClick={() => {this.toggleFilter(index)}}/>
							</div>))
            }
					</div>
				</div>
				<div className="grid-container">
					<div className="bottom-bar" style={this.state.showSidebar ? {visibility: 'visible',  opacity: '1'} : {visibility: 'hidden', opacity: '0', width: '0', minWidth: '0', marginTop: '0'}}>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('occasion')}}>
							<div className="filter-title__text">OCCASION</div>
							<img src={this.state.showFilters['occasion'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['occasion'] ? {display: 'none'} : {display: 'flex'}}>
							<div className={"filter-option" + (this.state.filters.includes('lawnparties') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('lawnparties')) this.addFilter("occasion", 'lawnparties')}}>lawnparties</div>
							<div className={"filter-option" + (this.state.filters.includes('formals') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('formals')) this.addFilter("occasion", 'formals')}}>formals</div>
							<div className={"filter-option" + (this.state.filters.includes('semi-formals') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('semi-formals')) this.addFilter("occasion", 'semi-formals')}}>semi-formals</div>
							<div className={"filter-option" + (this.state.filters.includes('interviews') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('interviews')) this.addFilter("occasion", 'interviews')}}>interviews</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('size')}}>
							<div className="filter-title__text">SIZE</div>
							<img src={this.state.showFilters['size'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['size'] ? {display: 'none'} : {display: 'flex'}}>
							<div className={"filter-option" + (this.state.filters.includes('XS') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('XS')) this.addFilter("size", 'XS')}}>XS</div>
							<div className={"filter-option" + (this.state.filters.includes('S') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('S')) this.addFilter("size", 'S')}}>S</div>
							<div className={"filter-option" + (this.state.filters.includes('M') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('M')) this.addFilter("size", 'M')}}>M</div>
							<div className={"filter-option" + (this.state.filters.includes('L') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('L')) this.addFilter("size", 'L')}}>L</div>
							<div className={"filter-option" + (this.state.filters.includes('XL') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('XL')) this.addFilter("size", 'XL')}}>XL</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('max_price')}}>
							<div className="filter-title__text">MAXIMUM PRICE</div>
							<img src={this.state.showFilters['max_price'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['max_price'] ? {display: 'none'} : {display: 'flex'}}>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $10') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $10')) this.addFilter("price", 'max-price: $10', 10)}}>$10</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $20') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $20')) this.addFilter("price", 'max-price: $20', 20)}}>$20</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $30') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $30')) this.addFilter("price", 'max-price: $30', 30)}}>$30</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $40') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $40')) this.addFilter("price", 'max-price: $40', 40)}}>$40</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $50') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $50')) this.addFilter("price", 'max-price: $50', 50)}}>$50</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('keyword')}}>
							<div className="filter-title__text">KEYWORD</div>
							<img src={this.state.showFilters['keyword'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['keyword'] ? {display: 'none'} : {display: 'flex'}}>
							<div 
								id={"keyword"}
								className={"filter-option" + (document.getElementById("keyword") && this.state.filters.includes(document.getElementById("keyword").innerHTML) ? " added" : "")}
								onKeyDown={(e) => {
									if ((e.key) === 'Enter') {
										if (!this.state.filters.includes(document.getElementById("keyword-txt").value))
											this.addFilter("keyword", document.getElementById("keyword-txt").value)
									}
								}}
								>
									<input type="text" id="keyword-txt"/>
								</div>
						</div>
					</div>
					<div className="feed-grid__container"><Grid images={this.state.dresses}/></div>
				</div>
			</div>
		);
	}
}

export default Feed;