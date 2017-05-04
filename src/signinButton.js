import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SignupForm from './signinForm';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class signinButton extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <button label="Sign Up" onTouchTap={this.handleOpen}>Log In</button>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          
          <Dialog
            
            actions={actions}
            modal={true}
            open={this.state.open}
          >
            <SignupForm/>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}