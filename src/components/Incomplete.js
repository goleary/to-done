import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';


class Incomplete extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Card>
        <CardHeader
          title='Incomplete Items'
        />
        <List>
          {this.props.tasks && this.props.tasks.map(c => {
            return (<ListItem primaryText={c} leftIcon={<CheckBoxOutline />} onClick={() => this.completeTask(c)} />)
          })}
        </List>
      </Card>
    );
  }
  completeTask(task) {
    this.props.completeTask(task);
  }
}

export default Incomplete;