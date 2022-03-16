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
                  <img  src="https://i.ibb.co/fFXgZN5/sale-2.jpg" alt="Li's Static Banner" />
                </Link>
              </div>
            </div>
            {/* Single Banner Area End Here */}
            {/* Begin Single Banner Area */}
            <div className="col-lg-4 col-md-4 text-center pt-xs-30">
              <div className="single-banner">
                <Link to="#">
                  <img src="https://i.ibb.co/mvNfCry/for-sale.jpg" alt="Li's Static Banner" />
                </Link>
              </div>
            </div>
            {/* Single Banner Area End Here */}
            {/* Begin Single Banner Area */}
            <div className="col-lg-4 col-md-4 text-center pt-xs-30">
              <div className="single-banner">
                <Link to="#">
                  <img src="https://i.ibb.co/VNCHYTT/sale.jpg" alt="Li's Static Banner" />
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
