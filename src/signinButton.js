import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SignInForm from './signinForm';

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
      <span>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <FlatButton label="Login" onTouchTap={this.handleOpen}/>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>

          <Dialog

            actions={actions}
            modal={true}
            open={this.state.open}
          >
            <div className="authModal" id="signinModal">
              <h2>Welcome back friend!</h2>
              <p>Let us help you continue to build the future.</p>
              <SignInForm history={this.props.history}/>
            </div>
          </Dialog>
        </MuiThemeProvider>
      </span>
    );
  }
}
