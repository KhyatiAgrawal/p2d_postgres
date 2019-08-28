import React from 'react';
import './feed.scss';

import Navbar from '../../components/Navbar/Navbar';
import Grid from '../../components/Grid/Grid';

import hamburger_green from '../../styles/svgs/landing_page/hamburger-green.svg'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

class Feed extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filters: props.filters || ['lawnparties', 'semi-formals', 'off-shoulder', 'strapless', 'h&m conscious', 'forever 21'],
			activeFilters: new Array(props.filters || 6).fill(false),
			showSidebar: localStorage.getItem( 'showSidebar' ) || false,
		}
	}

	toggleFilter = (index) => {
		this.state.activeFilters[index] = !this.state.activeFilters[index]
		this.forceUpdate()
	}

	toggleMenu = () => {
		localStorage.setItem('showSidebar', !this.state.showSidebar);
		this.setState({
			showSidebar: !this.state.showSidebar,
		})
	}

	addFilter = (filter) => {
		this.state.filters.unshift(filter)
		this.state.activeFilters.unshift(true)
		this.state.filters = this.state.filters.slice(0, 6)
		this.state.activeFilters = this.state.activeFilters.slice(0, 6)
		this.forceUpdate()
	}

	render() {
		const options = [
		  'one', 'two', 'three'
		]
		return (
			<div className="Feed">
				<div><Navbar weight="heavy"/></div>
				<div className="feed-title__container">
					<div className="feed-title__text">Explore our custom inventory</div>
				</div>
				<div className="filter-container">
					<div className="filter-container__item" onClick={this.toggleMenu}>
						<img src={hamburger_green} className="filter-img" />
						<div>more <br /> filters!</div>
					</div>
					<div className="filter-content__container" >
						{this.state.filters.map((item, index) => (
              <div
              	className={"filter-content__item" + (this.state.activeFilters[index] ? " selected" : "")}
              	onClick={() => {this.toggleFilter(index)}}
							>
								{this.state.filters[index]}
							</div>))
            }
					</div>
				</div>
				<div className="bottom-bar" style={this.state.showSidebar ? {visibility: 'visible',  opacity: '1'} : {visibility: 'hidden', opacity: '0', height: '0', marginTop: '0'}}>
					<div className="filter-title">
						occasion
					</div>
					<div className="filter-options">
						<div className={"filter-option" + (this.state.filters.includes('lawnparties') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('lawnparties')) this.addFilter('lawnparties')}}>+ lawnparties</div>
						<div className={"filter-option" + (this.state.filters.includes('formals') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('formals')) this.addFilter('formals')}}>+ formals</div>
						<div className={"filter-option" + (this.state.filters.includes('semi-formals') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('semi-formals')) this.addFilter('semi-formals')}}>+ semi-formals</div>
						<div className={"filter-option" + (this.state.filters.includes('interviews') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('interviews')) this.addFilter('interviews')}}>+ interviews</div>
						<div className={"filter-option" + (this.state.filters.includes('casual') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('casual')) this.addFilter('casual')}}>+ casual</div>
					</div>
					<div className="filter-title">
						size
					</div>
					<div className="filter-options">
						<div className={"filter-option" + (this.state.filters.includes('XS') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('XS')) this.addFilter('XS')}}>+ extra small</div>
						<div className={"filter-option" + (this.state.filters.includes('S') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('S')) this.addFilter('S')}}>+ small</div>
						<div className={"filter-option" + (this.state.filters.includes('M') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('M')) this.addFilter('M')}}>+ medium</div>
						<div className={"filter-option" + (this.state.filters.includes('L') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('L')) this.addFilter('L')}}>+ large</div>
						<div className={"filter-option" + (this.state.filters.includes('XL') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('XL')) this.addFilter('XL')}}>+ extra large</div>
					</div>
					<div className="filter-title">
						maximum price
					</div>
					<div className="filter-options">
						<div className={"filter-option" + (this.state.filters.includes('max-price: $10') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $10')) this.addFilter('max-price: $10')}}>+ $10</div>
						<div className={"filter-option" + (this.state.filters.includes('max-price: $20') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $20')) this.addFilter('max-price: $20')}}>+ $20</div>
						<div className={"filter-option" + (this.state.filters.includes('max-price: $30') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $30')) this.addFilter('max-price: $30')}}>+ $30</div>
						<div className={"filter-option" + (this.state.filters.includes('max-price: $40') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $40')) this.addFilter('max-price: $40')}}>+ $40</div>
						<div className={"filter-option" + (this.state.filters.includes('max-price: $50') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('max-price: $50')) this.addFilter('max-price: $50')}}>+ $50</div>
					</div>
					<div className="filter-title">
						availability
					</div>
					<div className="filter-options">
						<div className={"filter-option" + (this.state.filters.includes('in-use') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('in-use')) this.addFilter('in-use')}}>+ in-use</div>
						<div className={"filter-option" + (this.state.filters.includes('available') ? " added" : "")}  onClick={()=> { if (!this.state.filters.includes('available')) this.addFilter('available')}}>+ available</div>
					</div>
					<div className="filter-title">
						keyword
					</div>
					<div className="filter-options">
					</div>
				</div>
				<div className="grid-container">
					<Grid images={new Array(20).fill(0)}/>
				</div>
			</div>
		);
	}
}

export default Feed;