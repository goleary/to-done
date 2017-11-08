import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';

import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

import Task from './Task';


class Incomplete extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
      productivity: '',
      currentNext: '',
      currentCompleted: '',
      completed: [],
      next: [{name:'test', completed: false}],
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      tasks: nextProps.tasks
    });
  }
  render() {
    return (
      <Card>
        <CardHeader
          title='Incomplete Items'
        />
        <List>
          {this.state.tasks && this.state.tasks.map(task => {
            return (<Task name={task.name} completed={task.completed} toggleTask={taskName => this.toggleTask(taskName)}/>)
          })}
        </List>
        <CardActions>
          <FlatButton label="Save" />
        </CardActions>
      </Card>
    );
  }
  toggleTask(task) {
    this.state.tasks
  }
}

export default Incomplete;