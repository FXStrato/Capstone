/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import { RaisedButton, Dialog, FlatButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';
import _ from 'lodash';

/* Page displaying the specific details of each project */

class Project extends Component {
  state = {
    open: false,
    projTitle: '',
    projDesc: '',
    projLiner: '',
    projTags: '',
    projPostingCompany: '',
    projSupportingComps: '',
    projResources: '',
    projProfessionID: '',
    projPostDate: '',
    projEndDate: '',
    projEstimatedDuration: '',
    projRequirements: '',
    projFull: '',
    projID: this.props.params.projectID,
    projImage: '',
    projProfession: '',
  }

//Temp: -Kh4diidw7jpXDbKz-go

  componentDidMount = () => {
    window.scrollTo(0, 0);
    firebase.database().ref('/projects/' + this.props.params.projectID).once('value').then((snapshot) => {
      let temp = snapshot.val();

      //Additional Resources
      let addResources = _.map(temp.additional_resources, (elem,index) => {
        return <li key={'addResource-'+index}>{elem}</li>
      });

      this.setState({projTitle: temp.name, projDesc: temp.short_description, projEndDate: temp.due_date, projEstimatedDuration: temp.estimated_duration, projLiner: temp.one_liner, projProfessionID: temp.profession_type, projPostDate: temp.posting_date, projImage: temp.cover_image_link, projRequirements: temp.submission_requirements, projResources: addResources});

      firebase.database().ref('/professions/').once('value').then((snapshot) => {
        this.setState({projProfession: snapshot.val()[temp.profession_type]});
      });
      firebase.database().ref('/companies/').once('value').then((snapshot) => {
        let supportResults = _.map(temp.supporting_companies, (elem, index) => {
          return <span key={'supportingCompany-'+index} style={{marginRight: 10}}>{snapshot.val()[elem]['name']}</span>;
        });
        this.setState({projPostingCompany: snapshot.val()[temp.posting_company]['name'], projSupportingComps: supportResults});
      });
    });
  }

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
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <section>
        <div className="container">
          <Row>
            <Col s={12} m={6}>
              <h2>{this.state.projTitle || 'Empty project'}</h2>
              <div>
                {this.state.projLiner || 'One liner goes here'}
              </div>
              <p>{this.state.projPostDate || 'Post Date'} - {this.state.projEndDate || 'End Date'}</p>
              <p>{this.state.projDesc || 'Project description'}</p>
              <div>For: {this.state.projProfession || 'Profession goes here'}</div>
              <br/>
              <div>Company: {this.state.projPostingCompany || 'Posting company goes here'}</div>
              <div>Supporting Companies: {this.state.projSupportingComps || 'Supprting companies here'}</div>
              <div>
                <ul>
                  Additional Resources:
                  {this.state.projResources}
                </ul>
              </div>
              <div>
                Tags:
                <div className="chip">Java</div>
                <div className="chip">Python</div>
                <div className="chip">Django</div>
                <div className="chip">SQL</div>
              </div>
            </Col>
            <Col s={12} m={6}>
              <div className="card">
                <div className="card-image">
                  <img src={this.state.projImage} alt="AnswerDash Software Engineer Banner" className="responsive-img"/>

                </div>
                <div className="card-content">
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton primary={true} fullWidth={true} onTouchTap={this.handleOpen} label="Submit Project" />
                  </MuiThemeProvider>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            title={"Submission for " + this.state.projTitle}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            Submit a project link: <MuiThemeProvider muiTheme={getMuiTheme()}><TextField name="projectSubmission" /></MuiThemeProvider>
          </Dialog>
        </MuiThemeProvider>
      </section>
    );
  }
}


export default Project;
