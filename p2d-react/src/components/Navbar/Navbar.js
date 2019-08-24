import React, { Component } from 'react';
import bell from '../../styles/svgs/bell.svg';
import heart from '../../styles/svgs/heart.svg';
import cart from '../../styles/svgs/cart.svg';
import account from '../../styles/svgs/account.svg';
import feed from '../../styles/svgs/feed.svg';
import Logo from '../Logo/Logo.js'
import './Navbar.scss';

import hamburger from '../../styles/svgs/landing_page/hamburger.svg'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showHamburger: false,
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
    return (
      <div>
        <div className='p2d-nav'>
          <div className='p2d-nav-logo'>
            <Logo weight={"light"} showText={true}/>
          </div>
          <div className='p2d-nav-item__container'>
            <a className="nav-link" href="/account">
              <div className='p2d-nav-img'>
                <img src={account} className='nav-svg' alt="account" />
                <div className='helper-text'>account</div>
              </div>
            </a>
            <a className="nav-link" href="/feed">
              <div className='p2d-nav-img'>
                <img src={feed} className='nav-svg' alt="feed" />
                <div className='helper-text'>feed</div>
              </div>
            </a>
            <a className="nav-link" href="/#">
              <div className='p2d-nav-img'>
                <img src={bell} className='nav-svg' alt="notifications" />
                <div className='helper-text'>alerts</div>
              </div>
            </a>
            <a className="nav-link" href="/favorites">
              <div className='p2d-nav-img'>
                <img src={heart} className='nav-svg' alt="likes" />
                <div className='helper-text'>likes</div>
              </div>
            </a>
            <a className="nav-link" href="/cart">
              <div className='p2d-nav-img'>
                <img src={cart} className='nav-svg' alt="cart" />
                <div className='helper-text'>cart</div>
              </div>
            </a>
          </div>
          <div className="hamburger-container">
            <img src={hamburger} className='hamburger' onClick={this.toggleMenu}/>
          </div>
        </div>
        <div className="hamburger-content" style={!this.state.showHamburger ? {visibility: 'hidden'} : {visibility: 'visible', opacity: '1'}}>
          <a className="nav-link" href="/account"><div className="hamburger-content__item"><img src={account} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/feed"><div className="hamburger-content__item"><img src={feed} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/#"><div className="hamburger-content__item"><img src={bell} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/favorites"><div className="hamburger-content__item"><img src={heart} className='hamburger-svg' /></div></a>
          <a className="nav-link" href="/cart"><div className="hamburger-content__item"><img src={cart} className='hamburger-svg' /></div></a>
        </div>
      </div>
    );
  }
}

export default Navbar
