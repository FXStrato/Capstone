import React, { Component } from 'react';
import { Route, Switch, Link, withRouter, Redirect } from 'react-router-dom';
import {AppBar, Drawer, MenuItem, Toolbar, ToolbarGroup, FlatButton, Popover, Menu} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
import BlackLogo from "./img/logo_black.png";
import BlueLogo from "./img/frlogo_blue2.png";
import SignoutButton from "./signoutButton";
import firebase from 'firebase';
import Home from './Home';
import About from './About';
import Interests from './Interests';
import Dashboard from './Dashboard';
import Contact from './Contact';
import ProjectFullSpec from './ProjectFullSpec';
import SearchProjects from './SearchProjects';
import ProjectSubmission from './ProjectSubmission';
import SignupButton from './signupButton';
import SigninButton from './signinButton';
import Project from './Project';
import NotFound from './NotFound';
import AdminPanel from './AdminPanel';
import Browse from './Browse';

class App extends Component {
  state = {
    open: false,
    popoverOpen: false,
    isAuth: false,
  }

  handleActive = (path) => {
    this.handleToggle();
    if(location.pathname !== path) this.history.push(path);
  }

  handleToggle = () => {
    this.setState({open: !this.state.open});
  }

  handleActiveLink = (link) => {
    let path = location.pathname;
    if(path === link) {
      if(location.pathname !== '/' && link === '/') return {color: '#000'};
      return {backgroundColor: 'pink', color: '#000'};
    } else {
      return {color: '#000'};
    }
  }

  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({popoverOpen: true, anchorEl: event.currentTarget});
  }

  handlePopoverClose = () => {
    this.setState({popoverOpen: false});
  }

  handleSignOut = () => {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out!');
        location.reload();
    }).catch(function(error) {
        console.log(error);
    });
  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
     if(user) {
       console.log('Auth state changed: logged in as', user.email);
       this.setState({userID:user.uid});
       this.setState({userEmail:user.email});
       this.setState({isAuth: true});
       firebase.database().ref('users/' + user.uid).once('value').then(snapshot=> {
         if(snapshot.val()) {
           this.setState({
             userHandle: snapshot.val().firstName,
             userProfilePicLink: snapshot.val().photoURL,
             onboard: snapshot.val().onboard
            });
         }
       });
     }
     else{
       console.log('Auth state changed: logged out');
       this.setState({userID: null}); //null out the saved state
       this.setState({userEmail: null});
       this.setState({onboard: null});
       this.setState({userHandle: ''});
       this.setState({isAuth: false})
     }
   });
  }

  render() {
    let links = [{link: '/', body: 'Home'}, {link: '/interests', body: 'Interests'}, {link: '/projects', body: 'Search Projects'}, {link: '/about', body: 'About'},];
    let drawerlinks = _.map(links, (elem, index) => {
      let activeStyle = this.handleActiveLink(elem.link);
      return (
        <Link to={elem.link} key={'drawerlink-' + index}><MenuItem style={activeStyle}>{elem.body}</MenuItem></Link>
      )
    });

    return (
      <div className="body-wrapper">
        <header id="nav">
          <div className="navStyle">
          <div className="container">
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Toolbar style={{height: '64px', backgroundColor: 'transperant'}}>
                <ToolbarGroup firstChild={true}>
                  <AppBar
                    style={{backgroundColor: 'transperant', boxShadow: 'none'}}
                    onLeftIconButtonTouchTap={this.handleToggle}
                    id="navbar-appbar"
                    title={ <Link to="/"><img className="topLogo" src={BlueLogo} alt="Frontier Black Logo" style={{cursor: 'pointer'}}/></Link> }
                  />
                </ToolbarGroup>
                <ToolbarGroup>
                  <div className="hide-on-med-and-down">
                    {this.state.isAuth ?
                        <div>
                          <Link to="/dashboard" style={{position: 'absolute', top: 25, left: -150, width: 150}}>YOUR PROJECTS</Link>
                          <img style={{cursor: 'pointer'}} onTouchTap={this.handleTouchTap} className="profilePic hoverable" src={this.state.userProfilePicLink}/>
                          <Popover
                            open={this.state.popoverOpen}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handlePopoverClose}
                          >
                            <Menu>
                              <Link to="/projects" onTouchTap={this.handlePopoverClose}><MenuItem primaryText="Search Projects" /></Link>
                              <MenuItem onTouchTap={this.handleSignOut} primaryText="Sign out" />
                            </Menu>
                          </Popover>

                        </div>
                          :
                    <div>
                      <SigninButton history={this.props.history}/> <SignupButton history={this.props.history}/>
                    </div>}
                  </div>
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
                <div style={{height: 64, backgroundColor: '#212121'}}></div>
                {drawerlinks}
                {this.state.isAuth ?
                  <MenuItem onTouchTap={this.handleSignOut} primaryText="Sign out" />
                :
                <div>
                  <span style={{marginLeft: -8, marginBottom: '10px !important'}}><SigninButton/></span>
                  <span className="center-align" style={{marginLeft: 30, marginTop: 10}}><SignupButton/></span>
                </div>
                }

              </Drawer>
            </MuiThemeProvider>
          </div>
          </div>
        </header>
        <main>
          <Switch>
            <Route exact path="/" render={(props)=><Home {...props} userEmail={this.state.userEmail}/>}/>
            <Route path="/dashboard" render={(props)=>(this.state.isAuth ? <Dashboard {...props} userID={this.state.userID} isAuth={this.state.isAuth}/> : <Redirect to="/"/>)}/>
            <Route path="/project/:projectID" render={(props)=><Project {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail}/>}/>
            <Route path="/projectfull/:projectID" render={(props)=><ProjectFullSpec {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail}/>}/>
            <Route path="/submit/:projectID" render={(props)=><ProjectSubmission {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail}/>}/>
            <Route path="/admin" component={AdminPanel}/>
            <Route path="/about" component={About}/>
            <Route path="/interests" component={Interests}/>
            {/* <Route path="/projects/:searchTerm" component={SearchProjects}/>
            <Route path="/projects" component={SearchProjects}/> */}
            <Route path="/browse/:type" render={(props)=><Browse {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} onboard={this.state.onboard}/>}/>
            <Route path="/browse" render={(props)=><Browse {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail} onboard={this.state.onboard}/>}/>
            <Route path="/contact" component={Contact}/>
            <Route component={NotFound}/>
          </Switch>
        </main>
        <footer className="page-footer" style={{backgroundColor: '#212121'}}>
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">About Frontier</h5>
                <p className="grey-text text-lighten-4">Frontier is a platform that helps job seekers create amazing projects while connecting them to employers looking for incredible talent.</p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">Links</h5>
                <ul>
                  <li><Link to="projects" className="grey-text text-lighten-3">Projects</Link></li>
                  <li><Link to="about" className="grey-text text-lighten-3">About</Link></li>
                  <li><Link to="contact" className="grey-text text-lighten-3">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            © 2017 Frontier
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default withRouter(App);
