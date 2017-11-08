import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

class Task extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <ListItem primaryText={this.props.name} leftIcon={this.props.completed ? <CheckBox /> : <CheckBoxOutline />} onClick={() => this.toggleTask()} />
    );
  }
  toggleTask() {
    this.props.toggleTask(this.props.name);
  }
}

export default Task;