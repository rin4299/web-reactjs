import React, { Component } from 'react'
import RequestCart from 'components/Content/RequestCart/RequestCart'
// import LinkHere from '../components/LinkHere/LinkHere'

export default class RequestCartPage extends Component {
  render() {
    return (
      <div>
        <RequestCart match={this.props.match} ></RequestCart>
      </div>
    )
  }
}
