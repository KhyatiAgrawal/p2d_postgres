import React, { Component } from 'react';
import logo from '../../styles/svgs/logo.svg';
import './Logo.scss';

class Logo extends Component {
	render() {
    return (
      <div className="wrapper">
        <a className="p2d-link" href="/"><div className='p2d-logo-container'>
          <div className='p2d-logo'>
            <svg className="p2d-logo-svg" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
              <path className={"p2d-logo-img " + this.props.weight} d="M23,46 C10.2974508,46 0,35.7025492 0,23 C0,10.2974508 10.2974508,0 23,0 C35.7025492,0 46,10.2974508 46,23 C46,35.7025492 35.7025492,46 23,46 Z M23,41 C32.9411255,41 41,32.9411255 41,23 C41,13.0588745 32.9411255,5 23,5 C13.0588745,5 5,13.0588745 5,23 C5,32.9411255 13.0588745,41 23,41 Z M23,39 C14.163444,39 7,31.836556 7,23 C7,14.163444 14.163444,7 23,7 C31.836556,7 39,14.163444 39,23 C39,31.836556 31.836556,39 23,39 Z M18,21 C19.6568542,21 21,19.6568542 21,18 C21,16.3431458 19.6568542,15 18,15 C16.3431458,15 15,16.3431458 15,18 C15,19.6568542 16.3431458,21 18,21 Z M28,21 C29.6568542,21 31,19.6568542 31,18 C31,16.3431458 29.6568542,15 28,15 C26.3431458,15 25,16.3431458 25,18 C25,19.6568542 26.3431458,21 28,21 Z M18,31 C19.6568542,31 21,29.6568542 21,28 C21,26.3431458 19.6568542,25 18,25 C16.3431458,25 15,26.3431458 15,28 C15,29.6568542 16.3431458,31 18,31 Z M28,31 C29.6568542,31 31,29.6568542 31,28 C31,26.3431458 29.6568542,25 28,25 C26.3431458,25 25,26.3431458 25,28 C25,29.6568542 26.3431458,31 28,31 Z" />
            </svg>
          </div>
          <div style={this.props.showText ? {display:'flex'} : {display:'none'}} className={'p2d-logo-text ' + this.props.weight}>
           PRESS TO DRESS
          </div>
        </div></a>
      </div>
    );
  }
}

export default Logo
