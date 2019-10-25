import React from 'react';
import './feed.scss';

import Navbar from '../../components/Navbar/Navbar';
import Grid from '../../components/Grid/Grid';

import hamburger_green from '../../styles/svgs/landing_page/hamburger-green.svg'
import cross from '../../styles/svgs/cross.svg'
import plus from '../../styles/svgs/plus.svg'
import minus from '../../styles/svgs/minus.svg'
import black_heart from '../../styles/svgs/black-heart.svg'
import left_arrow from '../../styles/svgs/left-arrow.svg'

import dress1 from '../../styles/images/mock_dresses/mockdress_1.jpeg'
import dress2 from '../../styles/images/mock_dresses/mockdress_2.jpeg'
import dress3 from '../../styles/images/mock_dresses/mockdress_3.jpeg'

class Feed extends React.Component {
	constructor(props) {
		super(props)

		let dresses = {}
		for (var i = 0; i < 32; i++) {
			dresses[i] = {
				0: dress1,
				1: dress2,
				2: dress3,
				title: 'Linen Midi Dress',
				selected: 0,
				total: 3,
			}
		}

		let storedItems = JSON.parse(localStorage.getItem('state'))
		this.state = {
			filters: storedItems ? storedItems['filters'] : [],
			activeFilters: storedItems ? storedItems['activeFilters'] : new Array(0).fill(false),
			showSidebar: storedItems ? storedItems['showSidebar'] : true,
			showFilters: {
				occasion: storedItems ? storedItems['showFilters']['occasion'] : false,
				size: storedItems ? storedItems['showFilters']['size'] : false,
				max_price: storedItems ? storedItems['showFilters']['max_price'] : false,
				availability: storedItems ? storedItems['showFilters']['availability'] : false,
				keyword: storedItems ? storedItems['showFilters']['keyword'] : false,
			},
			dresses: dresses
		}
	}

	toggleFilter = (index) => {
		let newFilters = this.state.filters.slice()
		let newActiveFilters = this.state.activeFilters.slice()
		newActiveFilters[index] = newActiveFilters[index]
		newFilters = (newFilters.slice(0, index)).concat(newFilters.slice(index+1, newFilters.length))

		this.setState({
			filters: newFilters,
			activeFilters: newActiveFilters
		})
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

	addFilter = (filter) => {
		let newFilters = this.state.filters.slice()
		let newActiveFilters = this.state.activeFilters.slice()

		newFilters.unshift(filter)
		newActiveFilters.unshift(true)

		this.setState({
			filters: newFilters,
			activeFilters: newActiveFilters
		})
	}

	render() {
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
							<div className={"filter-option" + (this.state.filters.includes('lawnparties') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('lawnparties')) this.addFilter('lawnparties')}}>LAWNPARTIES</div>
							<div className={"filter-option" + (this.state.filters.includes('formals') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('formals')) this.addFilter('formals')}}>FORMALS</div>
							<div className={"filter-option" + (this.state.filters.includes('semi-formals') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('semi-formals')) this.addFilter('semi-formals')}}>SEMI-FORMALS</div>
							<div className={"filter-option" + (this.state.filters.includes('interviews') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('interviews')) this.addFilter('interviews')}}>INTERVIEWS</div>
							<div className={"filter-option" + (this.state.filters.includes('casual') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('casual')) this.addFilter('casual')}}>CASUAL</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('size')}}>
							<div className="filter-title__text">SIZE</div>
							<img src={this.state.showFilters['size'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['size'] ? {display: 'none'} : {display: 'flex'}}>
							<div className={"filter-option" + (this.state.filters.includes('XS') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('XS')) this.addFilter('XS')}}>XS</div>
							<div className={"filter-option" + (this.state.filters.includes('S') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('S')) this.addFilter('S')}}>S</div>
							<div className={"filter-option" + (this.state.filters.includes('M') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('M')) this.addFilter('M')}}>M</div>
							<div className={"filter-option" + (this.state.filters.includes('L') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('L')) this.addFilter('L')}}>L</div>
							<div className={"filter-option" + (this.state.filters.includes('XL') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('XL')) this.addFilter('XL')}}>XL</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('max_price')}}>
							<div className="filter-title__text">MAXIMUM PRICE</div>
							<img src={this.state.showFilters['max_price'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['max_price'] ? {display: 'none'} : {display: 'flex'}}>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $10') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $10')) this.addFilter('max-price: $10')}}>$10</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $20') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $20')) this.addFilter('max-price: $20')}}>$20</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $30') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $30')) this.addFilter('max-price: $30')}}>$30</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $40') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $40')) this.addFilter('max-price: $40')}}>$40</div>
							<div className={"filter-option" + (this.state.filters.includes('max-price: $50') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $50')) this.addFilter('max-price: $50')}}>$50</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('availability')}}>
							<div className="filter-title__text">AVAILABILITY</div>
							<img src={this.state.showFilters['availability'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['availability'] ? {display: 'none'} : {display: 'flex'}}>
							<div className={"filter-option" + (this.state.filters.includes('in-use') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('in-use')) this.addFilter('in-use')}}>IN-USE</div>
							<div className={"filter-option" + (this.state.filters.includes('available') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('available')) this.addFilter('available')}}>AVAILABLE</div>
						</div>
						<div className="filter-title" onClick={() => {this.toggleFilterDisplay('keyword')}}>
							<div className="filter-title__text">KEYWORD</div>
							<img src={this.state.showFilters['keyword'] ? minus : plus} className="filter-title__img" />
						</div>
						<div className="filter-options" style={!this.state.showFilters['keyword'] ? {display: 'none'} : {display: 'flex'}}>
						</div>
					</div>
					<Grid images={this.state.dresses}/>
				</div>
			</div>
		);
	}
}

export default Feed;