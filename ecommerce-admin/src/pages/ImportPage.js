import React, { Component } from 'react'
import  Import  from 'components/Content/Import/Import'


export default class ImportPage extends Component {
  render() {
    return (
      <Import match={this.props.match} ></Import>
    )
  }
}
