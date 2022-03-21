import React, { Component } from 'react'
import  HistoryRequest  from 'components/Content/HistoryRequest/HistoryRequest'


export default class HistoryRequestPage extends Component {
  render() {
    return (
      <HistoryRequest match={this.props.match} ></HistoryRequest>
    )
  }
}
