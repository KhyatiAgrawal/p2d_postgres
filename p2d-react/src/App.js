import React from 'react';
import './App.scss';
import Navbar from './components/Navbar/Navbar.js';
import './styles/fonts/fonts.scss'

import arrow from './styles/svgs/landing_page/down-arrow.svg'

import closet1 from './styles/images/landing_page/closet1.png'
import closet2 from './styles/images/landing_page/closet2.png'
import closet3 from './styles/images/landing_page/closet3.png'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      images: [closet1, closet2, closet3],
      text: ["Looking for something to wear?", "Faced with an empty closet?", "We've got you covered."]
    }
  }

  componentDidMount() {
    this.interval = setInterval(()=>{this.pageHandler(1)}, 2400);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  pageHandler = (op) => {
    let newPage
    if (this.state.pageNumber === 2) newPage = 0
    else if (this.state.pageNumber === 0 && op < 0) newPage = 2;
    else newPage = this.state.pageNumber + op;

    this.setState({
      pageNumber: newPage,
    })
  }

  dotHandler = (idx) => {
    this.setState({
      pageNumber: idx,
    })
  }

  render() {
    return (
      <div className="App">
        <div>
          <Navbar />
        </div>
        <div className="body-container">
          <div className="body-image">
            <img src={this.state.images[this.state.pageNumber]} className="body-image__img" />
          </div>
        	<div className="body-text">
        		<div className="main-text">Don't stress. <br/> Just press to dress.</div>
            <div className="byline-text">{this.state.text[this.state.pageNumber]}</div>
            <a className="p2d-link" href="/feed"><div className="link-text">Shop now></div></a>
        	</div>
        </div>
        <div className="body-footer">
          <div className="dot-container">
            {this.state.text.map((item, index) => (
              <span className={"dot" + (this.state.pageNumber === index ? ' selected' : '')} onClick={() => {this.dotHandler(index)}}/>))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
