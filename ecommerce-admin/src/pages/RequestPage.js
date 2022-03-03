import React, { Component } from 'react'
import  Request  from 'components/Content/Request/Request'


export default class RequestPage extends Component {
  render() {
    return (
      <Request match={this.props.match} ></Request>
    )
  }
}
