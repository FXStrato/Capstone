import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import { RaisedButton } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase';

/* Page displaying the specific details of each project */

class Project extends Component {
  state = {
    projTitle: '',
    projDesc: '',
    projLiner: '',
    projTags: '',
    projPostingCompany: '',
    projResources: '',
    projProfessionID: '',
    projPostDate: '',
    projEndDate: '',
    projEstimatedDuration: '',
    projRequirements: '',
    projFull: '',
    projID: this.props.params.projectID,
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
    return firebase.database().ref('/projects/' + this.props.params.projectID).once('value').then((snapshot) => {
      let temp = snapshot.val();
      this.setState({projTitle: temp.name, projDesc: temp.short_description, projEndDate: temp.due_date, projEstimatedDuration: temp.estimated_duration, projPostingCompany: temp.posting_company, projLiner: temp.one_liner, projProfessionID: temp.profession_type, projPostDate: temp.posting_date});
    });
  }


  render() {
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
              <div></div>
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
                  <img src="https://static.pexels.com/photos/90807/pexels-photo-90807.jpeg" alt="AnswerDash Software Engineer Banner" className="responsive-img"/>

                </div>
                <div className="card-content">
                  <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <RaisedButton primary={true} fullWidth={true} label="Submit Project" />
                  </MuiThemeProvider>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    );
  }
}


export default Project;
