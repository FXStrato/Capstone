import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SignupForm from './signupForm';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class signupButton extends React.Component {
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
      <span>
        <button className="signUpButton" label="Sign Up" onTouchTap={this.handleOpen}>Create an Account</button>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          
          <Dialog
            actions={actions}
            modal={true}
            open={this.state.open}
          >
            <div className="authModal" id="signUpModal">
              <h2>Join the party!</h2>
              <p>Having an account to Frontier gives you access to all Full Project Specifications and allows you to submit your project to interested companies.</p>
              <SignupForm history={this.props.history}/>
            </div>
            
            
            
          </Dialog>
        </MuiThemeProvider>
      </span>
    );
  }
}