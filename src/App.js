import React, { Component } from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import {AppBar, Drawer, MenuItem, Toolbar, ToolbarGroup, FlatButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
import BlackLogo from "./img/logo_black.png";
import SignoutButton from "./signoutButton";
import firebase from 'firebase';
import Home from './Home';
import About from './About';
import Interests from './Interests';
import Dashboard from './Dashboard';
import Contact from './Contact';
import ProjectFullSpec from './ProjectFullSpec';
import SearchProjects from './SearchProjects';
import Project from './Project';
import AdminPanel from './AdminPanel';

class App extends Component {
  state = {
    open: false,
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
             userProfilePicLink: snapshot.val().photoURL
            });
         }
       });
     }
     else{
       console.log('Auth state changed: logged out');
       this.setState({userID: null}); //null out the saved state
       this.setState({userEmail: null})
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
        <header id="nav" style={{backgroundColor: '#ffffff'}}>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Toolbar style={{height: '64px', backgroundColor: '#ffffff'}}>
            <ToolbarGroup firstChild={true}>
              <AppBar
                style={{backgroundColor: '#ffffff', boxShadow: 'none'}}
                onLeftIconButtonTouchTap={this.handleToggle}
                id="navbar-appbar"
                title={ <Link to="/"><img className="topLogo" src={BlackLogo} alt="Frontier Black Logo" style={{cursor: 'pointer'}}/></Link> }
              />
            </ToolbarGroup>
            <ToolbarGroup>
              <div className="hide-on-med-and-down">
                {this.state.isAuth ? <Link to="/dashboard"><div><span>{this.state.userHandle}</span><img className="profilePic" src={this.state.userProfilePicLink}/></div></Link> : ''}

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
            </Drawer>
          </MuiThemeProvider>
        </header>
        <main>
          <Switch>
            <Route exact path="/" render={()=><Home userEmail={this.state.userEmail}/>}/>
            <Route path="/dashboard" render={()=><Dashboard userEmail={this.state.userEmail}/>}/>
            <Route path="/project/:projectID" render={(props)=><Project {...props} isAuth={this.state.isAuth} userID={this.state.userID} userEmail={this.state.userEmail}/>}/>
            <Route path="/projectfull/:projectID" render={(props)=><ProjectFullSpec {...props} isAuth={this.state.isAuth} userEmail={this.state.userEmail}/>}/>
            <Route path="/admin" component={AdminPanel}/>
            <Route path="/about" component={About}/>
            <Route path="/interests" component={Interests}/>
            <Route path="/projects/:searchTerm" component={SearchProjects}/>
            <Route path="/projects" component={SearchProjects}/>
            <Route path="/contact" component={Contact}/>
          </Switch>
        </main>
        <footer className="page-footer" style={{backgroundColor: '#212121'}}>
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">About Frontier</h5>
                <p className="grey-text text-lighten-4">Frontier is a platform that helps job seekers create amazing projects while connecting them to employers looking for incredible talent.</p>
                <SignoutButton />
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
          <div className="footer-copyright" style={{backgroundColor: "#333"}}>
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
