import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class BannerMiddle extends Component {
  render() {
    return (
      <div className="li-static-banner" style={{marginTop: -50}}>
        <div className="container">
          <div className="row">
            {/* Begin Single Banner Area */}
            <div className="col-lg-4 col-md-4 text-center">
              <div className="single-banner">
                <Link to="#">
                  <img src="https://i.ibb.co/Fs4BNMn/1-3.jpg" alt="Li's Static Banner" />
                </Link>
              </div>
            </div>
            {/* Single Banner Area End Here */}
            {/* Begin Single Banner Area */}
            <div className="col-lg-4 col-md-4 text-center pt-xs-30">
              <div className="single-banner">
                <Link to="#">
                  <img src="https://i.ibb.co/6RLptfX/1-4.jpg" alt="Li's Static Banner" />
                </Link>
              </div>
            </div>
            {/* Single Banner Area End Here */}
            {/* Begin Single Banner Area */}
            <div className="col-lg-4 col-md-4 text-center pt-xs-30">
              <div className="single-banner">
                <Link to="#">
                  <img src="https://i.ibb.co/0YQVK7Y/1-5.jpg" alt="Li's Static Banner" />
                </Link>
              </div>
            </div>
            {/* Single Banner Area End Here */}
          </div>
        </div>
      </div>

    )
  }
}
