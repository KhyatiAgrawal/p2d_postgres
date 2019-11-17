import React, { Component } from 'react';
import './Grid.scss';

import arrow_left from '../../styles/svgs/side-arrow-left.svg'
import arrow_right from '../../styles/svgs/side-arrow-right.svg'

import Modal from '../Modal/Modal'

class Grid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: {},
    }
  }

  nextDress = (key, op) => {
    let images = this.state.images
    if (op === -1) {
      if (images[key].selected === 0) images[key].selected = images[key].total -1
      else images[key].selected = images[key].selected - 1
    } else {
      if (images[key].selected === images[key].total - 1) images[key].selected = 0
      else images[key].selected = images[key].selected + 1
    }
    this.setState({
      images: images
    })
  }

  toggleQuickView = (key, index) => {
    let images = this.state.images
    images[key].modal = !images[key].modal
    this.setState({
      images: images
    })
  }

  toggleDress = (key) => {
    let images = this.state.images
    images[key].principal = !this.state.images[key].principal
    this.setState({
      images: images
    })
  }

  componentWillReceiveProps({images}) {
    let dress_data = {}
    for (let i in images) {
      dress_data[i] = {
        ...images[i],
        principal: true,
        modal: false,
      }
    }
    this.setState({
      images: dress_data,
    })
  }

	render() {
    return (
      <div className="grid__container">
        <div className="wrapper">
        {Object.keys(this.state.images).map((key, index) => ( 
          <div className="dress-container">
            <div className="image-container">
              <img
                src={this.state.images[index].principal ? this.state.images[index][0] : this.state.images[index][1]}
                className="image-container__img"
              />
              <div className='dress-overlay' onMouseOver={() => this.toggleDress(index)}
                onMouseOut={() => this.toggleDress(index)} onClick={() => {this.toggleQuickView(key)}}>    
              </div>
              <div className="modal-container" style={this.state.images[index].modal ? {display: 'block'} : {display: 'none'}} >
                <Modal image={this.state.images[index]} onClick={() => {this.toggleQuickView(key)}}/>
              </div>
            </div>
            <div className="dress-title__container">
              <div className="dress-title">{this.state.images[index].title}</div>
              <div className="dress-rental">${this.state.images[index].price}.00</div>
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  }
}

export default Grid