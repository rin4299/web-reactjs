import React, { Component } from 'react'
import ActionReportProduct from 'components/Content/ProductReport/ActionReportProduct';

export default class ActionReportProductPage extends Component {
  render() {
    const { match } = this.props;
    let id;
    if (match) {
      id = match.params.id;
    }
    return (
      <ActionReportProduct id={id} ></ActionReportProduct>
    )
  }
}
