import React, { Component } from 'react'
import HistoryOrder from '../components/HistoryOrder/HistoryOrder';
import LinkHere from '../components/LinkHere/LinkHere'
export default class HistoryOrderPage extends Component {
  render() {
    const url = this.props.match.match.url;
    return (
      <div>
        <LinkHere url={url}></LinkHere>
        <HistoryOrder></HistoryOrder>
      </div>
    )
  }
}
