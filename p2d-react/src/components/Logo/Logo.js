import React, { Component } from 'react';
import logo from '../../styles/svgs/logo.svg';
import './Logo.scss';

class Logo extends Component {
	render() {
    return (
      <div className="wrapper">
        <div className='p2d-logo-container'>
          <div className='subcontainer p2d-logo'>
            <img src={logo} className="p2d-logo-img" alt="logo" />
          </div>
          <div className='subcontainer p2d-logo-text'> PRESS TO DRESS </div>
        </div>
      </div>
    );
  }
}

export default Logo
