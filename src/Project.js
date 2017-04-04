import React, { Component } from 'react';
import {Row, Col} from 'react-materialize';
import { RaisedButton } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

/* Page displaying the specific details of each project */

class Project extends Component {

  componentDidMount = () => {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <section>
        <div className="container">
          <Row>
            <Col s={12} m={6}>
              <h2>Project {this.props.params.projectID}</h2>
              Project description here.
              <ul className="browser-default">
                <li>Bullet points of features, and requirements</li>
                <li>Additional info can also be included</li>
              </ul>
              <p>Company information, etc.</p>
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
