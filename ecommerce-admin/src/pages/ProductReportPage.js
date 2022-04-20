import React, { Component } from 'react'
import  ProductReport  from 'components/Content/ProductReport/ProductReport'


export default class ProductReportPage extends Component {
  render() {
    return (
      <ProductReport match={this.props.match} ></ProductReport>
    )
  }
}
