import React, { Component } from 'react'
import ActionYourRequest from 'components/Content/YourRequest/ActionYourRequest';

export default class ActionYourRequestPage extends Component {
  render() {
    const { match } = this.props;
    console.log('props',this.props)
    let id;
    if (match) {
      console.log('params',match)
      id = match.params.id;
    }
    return (
      <ActionYourRequest id={id} ></ActionYourRequest>
    )
  }
}
