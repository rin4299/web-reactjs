import React, { Component } from 'react'
import  Tracking  from '../components/Content/Tracking/Tracking'


export default class TrackingPage extends Component {
  render() {
    return (
      <Tracking match={this.props.match} ></Tracking>
    )
  }
}
