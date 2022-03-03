import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class BannerRight extends Component {
  render() {
    return (
      <div className="col-lg-4 col-md-4 text-center pt-xs-30">
        <div className="li-banner">
          <Link tp="#">
            <img src="https://i.ibb.co/FHr1bng/1-1.jpg" alt="not found" />
          </Link>
        </div>
        <div className="li-banner mt-15 mt-sm-30 mt-xs-30">
          <Link tp="#">
            <img src="https://i.ibb.co/27bsVKQ/1-2.jpg" alt="not found" />
          </Link>
        </div>
      </div>
    )
  }
}
