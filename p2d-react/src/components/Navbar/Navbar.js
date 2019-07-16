import React, { Component } from 'react';
import bell from '../../styles/svgs/bell.svg';
import heart from '../../styles/svgs/heart.svg';
import cart from '../../styles/svgs/cart.svg';
import Logo from '../Logo/Logo.js'
import './Navbar.scss';

class Navbar extends Component {
	render() {
    return (
      <div className='p2d-nav'>
        <div className='p2d-nav-logo'>
          <Logo />
        </div>
        <div className='p2d-nav-item'>my account</div>
        <div className='p2d-nav-item'>my feed</div>
        <div className='p2d-nav-item'>
          <img src={bell} className='nav-svg' alt="logo" />
        </div>
        <div className='p2d-nav-item'>
          <img src={heart} className='nav-svg' alt="logo" />
        </div>
        <div className='p2d-nav-item'>
          <img src={cart} className='nav-svg' alt="logo" />
        </div>
      </div>
    );
  }
}

export default Navbar
