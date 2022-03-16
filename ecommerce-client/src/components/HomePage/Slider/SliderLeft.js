import React, { Component } from 'react'

export default class SliderLeft extends Component {
  render() {
    return (
      <div className="col-lg-8 col-md-8">
        <div className="slider-area">
          <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img className="d-block w-100" src="https://i.ibb.co/1KW07L8/Screen-Shot-2022-03-16-at-20-12-37.png" alt="First slide" />
              </div>
              <div className="carousel-item">
                <img className="d-block w-100" src="https://i.ibb.co/R6cL1pY/Screen-Shot-2022-03-16-at-20-13-38.png" alt="Second slide" />
              </div>
              <div className="carousel-item">
                <img className="d-block w-100" src="https://i.ibb.co/1mn4pG4/Screen-Shot-2022-03-16-at-20-14-23.png" alt="Third slide" />
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
