import React from 'react';
import './App.scss';
import Navbar from './components/Navbar/Navbar.js';
import './styles/fonts/fonts.scss'

import arrow from './styles/svgs/landing_page/down-arrow.svg'

import closet1 from './styles/images/landing_page/closet1.png'
import closet2 from './styles/images/landing_page/closet2.png'
import closet3 from './styles/images/landing_page/closet3.png'

import dress1 from './styles/images/mock_dresses/homepage1.jpg'
import dress2 from './styles/images/mock_dresses/homepage2.jpg'
import dress3 from './styles/images/mock_dresses/homepage3.jpg'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      textNumber: 0,
      images: [closet1, closet2, closet3],
      text: ["Looking for something to wear?", "Faced with an empty closet?", "We've got you covered."],
      backgroundImages: [dress1, dress2, dress3]
    }
  }

  componentDidMount() {
    this.interval = setInterval(()=>{this.pageHandler(1)}, 3000);
    this.interval = setInterval(()=>{this.textHandler(1)}, 3030);

    let img1 = new Image(dress1);
    let img2 = new Image(dress2);
    let img3 = new Image(dress3);

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

  textHandler = (op) => {
    let newText
    if (this.state.textNumber === 2) newText = 0
    else if (this.state.textNumber === 0 && op < 0) newText = 2;
    else newText = this.state.textNumber + op;

    this.setState({
      textNumber: newText,
    })
  }

  dotHandler = (idx) => {
    this.setState({
      pageNumber: idx,
      textNumber: idx,
    })
  }

  render() {
    return (
      <div className="App" style={{backgroundImage: "url(" + this.state.backgroundImages[this.state.pageNumber] + ")"}}>
        <div>
          <Navbar />
        </div>
        <div className="body-container">
        	<div className="body-text">
        		<div className="main-text">Don't stress. <br/> Just press to dress.</div>
            <div className="byline-text">{this.state.text[this.state.textNumber]}</div>
            <a className="p2d-link" href="/feed"><div className="link-text">{"Shop now >"}</div></a>
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
