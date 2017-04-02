import React, { Component } from 'react';
import {Link} from 'react-router';
import {Row, Col} from 'react-materialize';
import {TextField, RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class Home extends Component {
  state = {
  }

  handleChange = (event) => {
    var field = event.target.name;
    var value = event.target.value;
    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
    }

    handleSubmit = (event) => {
      console.log('name', this.state.name);
      console.log('email', this.state.email);
      event.preventDefault();
    }


  render() {
    return (
      <div>
        <Row>
          <Col s={12}>
            Home page is here <br/>
            <Link to="/project/123">Link to project 123</Link>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <form role="form">
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField style={{color: '#039BE5'}} floatingLabelText="Email" fullWidth={true} type="email" name="email" onChange={(e) => {this.handleChange(e)}} />
              </MuiThemeProvider>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <TextField style={{color: '#039BE5'}} floatingLabelText="Name" fullWidth={true} type="text" name="name" onChange={(e) => {this.handleChange(e)}} />
              </MuiThemeProvider>
              <MuiThemeProvider muiTheme={getMuiTheme()}>
                <RaisedButton onTouchTap={this.handleSubmit}>Submit</RaisedButton>
              </MuiThemeProvider>
            </form>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Home;
