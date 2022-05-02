import React, { Component } from 'react'
import Routing from '../components/Content/Routing/Routing'


export default class RoutingPage extends Component {
  render() {
    return (
      <Routing match={this.props.match} ></Routing>
    )
  }
}
