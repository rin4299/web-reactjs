import React, { Component } from 'react'
import  YourRequest  from 'components/Content/YourRequest/YourRequeset'


export default class YourRequestPage extends Component {
  render() {
    return (
      <YourRequest match={this.props.match} ></YourRequest>
    )
  }
}
