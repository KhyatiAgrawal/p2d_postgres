import React, { Component } from 'react';
import Logo from '../Logo/Logo.js'
import './Navbar.scss';

import hamburger from '../../styles/svgs/landing_page/hamburger.svg'
import hamburger_green from '../../styles/svgs/landing_page/hamburger-green.svg'
import bell from '../../styles/svgs/bell.svg';
import heart from '../../styles/svgs/heart.svg';
import cart from '../../styles/svgs/cart.svg';
import account from '../../styles/svgs/account.svg';
import feed from '../../styles/svgs/feed.svg';
import hanger from '../../styles/svgs/hanger_white.svg';
import history from '../../styles/svgs/history.svg';
import faq from '../../styles/svgs/faq.svg';
import bell_green from '../../styles/svgs/bell-green.svg';
import heart_green from '../../styles/svgs/heart-green.svg';
import cart_green from '../../styles/svgs/cart-green.svg';
import account_green from '../../styles/svgs/account-green.svg';
import feed_green from '../../styles/svgs/feed-green.svg';
import hanger_green from '../../styles/svgs/hanger_green.svg';
import history_green from '../../styles/svgs/history_green.svg';
import faq_green from '../../styles/svgs/faq-green.svg';

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showHamburger: false,
      content_icon: (this.props.weight === "heavy") ? hamburger_green : hamburger,
      icons: (this.props.weight === "heavy")
              ? [account_green, feed_green, history_green, heart_green, cart_green, faq_green]
              : [account, feed, history, heart, cart, faq]
    }
  }

  toggleMenu = () => {
    this.setState({
      showHamburger: !this.state.showHamburger,
    })
  }

  handleResize = () => {
    if (window.innerWidth > 700) {
      this.setState({
        showHamburger: false,
      })
    }
  }

	render() {
    window.addEventListener("resize", this.handleResize);
    const weight = this.props.weight || "light"

    return (
      <div className={"p2d-nav " + weight}>
        <div className='p2d-nav__container'>
          <div className='p2d-nav-logo'>
            <Logo weight={this.props.weight || "light"} showText={true}/>
          </div>
          <div className='p2d-nav-item__container'>
            <a className="nav-link" href="/account">
              <div className='p2d-nav-img'>
                <img src={this.state.icons[0]} className='nav-svg' alt="account" />
                <div className={'helper-text ' + weight}>account</div>
              </div>
            </a>
            <a className="nav-link" href="/feed">
              <div className='p2d-nav-img'>
                <img src={this.state.icons[1]} className='nav-svg' alt="feed" />
                <div className={'helper-text ' + weight}>feed</div>
              </div>
            </a>
            <a className="nav-link" href="/orders">
              <div className='p2d-nav-img'>
                <img src={this.state.icons[2]} className='nav-svg' alt="notifications" />
                <div className={'helper-text ' + weight}>orders</div>
              </div>
            </a>
            <a className="nav-link" href="/favorites">
              <div className='p2d-nav-img'>
                <img src={this.state.icons[3]} className='nav-svg' alt="likes" />
                <div className={'helper-text ' + weight}>likes</div>
              </div>
            </a>
            <a className="nav-link" href="/cart">
              <div className='p2d-nav-img'>
                <img src={this.state.icons[4]} className='nav-svg' alt="cart" />
                <div className={'helper-text ' + weight}>cart</div>
              </div>
            </a>
            <a className="nav-link" href="/#">
              <div className='p2d-nav-img'>
                <img src={this.state.icons[5]} className='nav-svg' alt="faq" />
                <div className={'helper-text ' + weight}>FAQs</div>
              </div>
            </a>
          </div>
          <div className="hamburger-container">
            <img src={this.state.content_icon} className='hamburger' onClick={this.toggleMenu}/>
          </div>
        </div>
        <div className={"hamburger-content " + weight} style={!this.state.showHamburger ? {visibility: 'hidden'} : {visibility: 'visible', opacity: '1'}}>
          <a className="nav-link" href="/account"><div className="hamburger-content__item"><img src={this.state.icons[0]} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/feed"><div className="hamburger-content__item"><img src={this.state.icons[1]} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/#"><div className="hamburger-content__item"><img src={this.state.icons[2]} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/favorites"><div className="hamburger-content__item"><img src={this.state.icons[3]} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/cart"><div className="hamburger-content__item"><img src={this.state.icons[4]} className='hamburger-svg' /></div></a>
        </div>
      </div>
    );
  }
}

export default Navbar
