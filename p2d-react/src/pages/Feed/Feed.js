import React from 'react';
import './feed.scss';

import Navbar from '../../components/Navbar/Navbar';
import Grid from '../../components/Grid/Grid';

import hamburger_green from '../../styles/svgs/landing_page/hamburger-green.svg'

class Feed extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filters: props.filters || ['lawnparties', 'semi-formals', 'off-shoulder', 'strapless', 'h&m conscious', 'forever 21'],
			activeFilters: new Array(props.filters || 6).fill(false)
		}
	}

	toggleFilter = (index) => {
		this.state.activeFilters[index] = !this.state.activeFilters[index]
		this.forceUpdate()
	}

	render() {
		return (
			<div className="Feed">
				<div><Navbar weight="heavy"/></div>
				<div className="feed-title__container">
					<div className="feed-title__text">Explore our custom inventory</div>
				</div>
				<div className="filter-container">
					<div className="filter-container__item">
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
				<div className="grid-container">
					<Grid images={new Array(20).fill(0)}/>
				</div>
			</div>
		);
	}
}

export default Feed;