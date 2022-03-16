import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class BannerRight extends Component {
  render() {
    return (
      <div className="col-lg-4 col-md-4 text-center pt-xs-30">
        <div className="li-banner">
          <Link tp="#">
            <img src="https://i.ibb.co/tzKgK5r/Screen-Shot-2022-03-16-at-20-09-07.png" alt="not found" />
          </Link>
        </div>
        <div className="li-banner mt-15 mt-sm-30 mt-xs-30">
          <Link tp="#">
            <img src="https://i.ibb.co/Ytbdqp5/Screen-Shot-2022-03-16-at-20-11-00.png" alt="not found" />
          </Link>
        </div>
      </div>
    )
  }
}
