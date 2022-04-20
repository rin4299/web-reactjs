import React, { Component } from 'react'
import ActionImport from '../components/Content/Import/ActionImport';

export default class ActionImportPage extends Component {
  render() {
    const { match } = this.props;
    let id;
    if (match) {
      id = match.params.id;
    }
    return (
      <ActionImport id={id} ></ActionImport>
    )
  }
}
