import React, { Component } from 'react';
import { useLayoutEffect, useState } from 'react';
import './faq.scss';

import Navbar from '../../components/Navbar/Navbar';

class FAQ extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orders: [0, 0, 0, 0, 0, 0, 0],
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

	componentDidMount() {
	    window.addEventListener("resize", this.handleResize);
	}

	componentWillUnmount() {
	    window.removeEventListener("resize", this.handleResize);
	}

	render() {
		const newWidth = this.state.windowSize * 0.75 * 0.1;
		const alpha = 0.2;
	    return (
	    	<div className="FAQ">
	    		<div><Navbar weight="heavy"/></div>

	    		<div className="faq-title-top__container">
					<div className="faq-title-top__text">FAQs</div>
				</div>

				<div className="faq-container">
		    		<div className="faq-title__container">
						<div className="faq-title__text">What is PressToDress?</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`PressToDress is a local, sustainable, fashionable and affordable 
						dress rental service exclusively for Princeton students. Whether you're looking for a formal, smart casual, party or lawnparties dress, we've got you covered! `}</div>
					</div>
					<div className="faq-title__container">
						<div className="faq-title__text">{`Do I have to wash the dress before or after renting?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`No! We will ensure your dress is properly laundered everytime you rent it. We want renting to be as easy for you as possible.`}</div>
					</div>

					<div className="faq-title__container">
						<div className="faq-title__text">{`How long can I rent a dress for?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`Our rental period is three days. We allow the our customers to pick up the dress one day before they want to wear it, and return it one day after. If you need the dress for a slightly longer period, we will accomodate, just let us know in advance.`}</div>
					</div>

					<div className="faq-title__container">
						<div className="faq-title__text">{`What if I cannot return at the scheduled drop-off time?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`Because we're a student initiative with limited budget and resources, we have a strict return policy. If you're unable to return the dress, then it is your responsibility to contact a member of our team and return it as soon as possible. We can charge a discretionary fine of $2 per day for late returns`}</div>
					</div>

					<div className="faq-title__container">
						<div className="faq-title__text">{`What if I accidentally damage or stain the dress?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`We trust you to handle the dresses with care, because our team has worked hard to establish this service for you. You may incurr a fine of upto $10 for damages to the dresses`}</div>

					</div>
					<div className="faq-title__container">
						<div className="faq-title__text">{`Why am I only allowed to try-on a max of 5 dresses?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`When we schedule a trial with you, we reserve all the dresses in your trial cart for the day you want to rent them. We want to be fair to all our users, and we want you to have adequate time to try everything in the thirty minute trial period. You can always schedule another try-on request if you don't like anything during the first trial.`}</div>

					</div>
					<div className="faq-title__container">
						<div className="faq-title__text">{`Who should I contact if I identify an issue with the website`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`If you're experiencing any issues with our site, we apologize. Please email khyatia@princeton.edu or uuberoy@princeton.edu at your earliest convenience, and we will resolve the issue as soon as possible. Thank you for your patience!`}</div>

					</div>

					<div className="faq-title__container">
						<div className="faq-title__text">{`How can I donate a dress?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`We would love to accept any one-piece women's clothing that you'd like to donate. Please reach out to presstodressprinceton@gmail.com, and we'll reply shortly. Thank you for your support!`}</div>

					</div>
					<div className="faq-title__container">
						<div className="faq-title__text">{`How can I sell a dress?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`Keep an eye-out for another "buy-from-students" email from us next semester. During our "buy-from-students" events we accept undamaged, one-pieces clothing items from Princeton studnets at a minimum rate of $5. `}</div>

					</div>
					<div className="faq-title__container">
						<div className="faq-title__text">{`I would like to join the PressToDress team, who should I contact?`}</div>
					</div>

					<div className="infoFAQ__container">
						<div className="infoFAQ__text">{`Awesome! Thanks for your interest. At the moment, we need administrative staff to scale our service. If you're able to commit 4 hours per week, please reach out to any member of our team, and they would be glad to tell you more about our initiative and get you on board!`}</div>

					</div>
				</div>
	    	</div>
		);
	}
}

export default FAQ