import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import {AppBar, Drawer, MenuItem, Toolbar, ToolbarGroup, FlatButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';

class App extends Component {
  state = {
    open: false,
  }

  goHome = () => {
    if(browserHistory.getCurrentLocation().pathname !== '/') browserHistory.push('/');
  }

  handleActive = (path) => {
    if(browserHistory.getCurrentLocation().pathname !== path) browserHistory.push(path);
  }

  handleToggle = () => {
    this.setState({open: !this.state.open});
  }

  handleActiveLink = (link) => {
    let path = browserHistory.getCurrentLocation().pathname;
    if(path === link) {
      if(browserHistory.getCurrentLocation().pathname !== '/' && link === '/') return {color: '#000'};
      return {backgroundColor: 'pink', color: '#000'};
    } else {
      return {color: '#000'};
    }
  }

  render() {
    let links = [{link: '/', body: 'Home'}, {link: '/project/123', body: 'Project 123'}];
    let drawerlinks = _.map(links, (elem, index) => {
      let activeStyle = this.handleActiveLink(elem.link);
      return (
        <MenuItem style={activeStyle} key={'drawerlink-' + index} onTouchTap={() => this.handleActive(elem.link)}>{elem.body}</MenuItem>
      )
    });

    return (
      <div>
        <header>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Toolbar style={{height: '64px', backgroundColor: '#455A64'}}>
            <ToolbarGroup firstChild={true}>
              <AppBar
                onTitleTouchTap={this.goHome}
                style={{backgroundColor: '#455A64', boxShadow: 'none'}}
                onLeftIconButtonTouchTap={this.handleToggle}
                id="navbar-appbar"
                title={<span style={{cursor: 'pointer'}}>Frontier</span>}
              />
            </ToolbarGroup>
            <ToolbarGroup>
              <FlatButton>Profile</FlatButton>
            </ToolbarGroup>
          </Toolbar>
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Drawer
                width={230}
                open={this.state.open}
                docked={false}
                onRequestChange={(open) => this.setState({open})}
              >
                <div style={{height: 64, backgroundColor: '#455A64'}}></div>
                {drawerlinks}
              </Drawer>
            </MuiThemeProvider>
        </header>
        <main class="container">
          {this.props.children}
        </main>
        <footer>
          	&copy; Frontier 2017
        </footer>
      </div>
    );
  }
}

export default App;
