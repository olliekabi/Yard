import React, { Component } from 'react';
import { Container } from 'reactstrap';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <Container style={{height: '100vh', width: '100vw'}}>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
