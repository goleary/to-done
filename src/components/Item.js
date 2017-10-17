import React, { Component } from 'react';

class Item extends Component {
  constructor() {
    super();
  }
  render(){
    return (<li>
    <h3>{this.props.item.productivity}</h3>
    {this.props.item.completed && this.props.item.completed.map(c => {
      return (<p>{c}</p>)
    })}
    <button onClick={() => this.remove()}>Remove Item</button>
  </li>)
  }
  remove(){
    this.props.deleteMe(this.props.item.id);
  }
}

export default Item;
