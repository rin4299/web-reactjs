import React, { Component } from 'react'
import LinkHere from '../components/LinkHere/LinkHere'
import SuggestionCart from '../components/SuggestionCart/SuggestionCart';
export default class SuggestionCartPage extends Component {
  render() {
    const url = this.props.match.match.url;
    return (
      <div>
        <LinkHere url={url}></LinkHere>
        <SuggestionCart></SuggestionCart>
      </div>
    )
  }
}
