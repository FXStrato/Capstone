import React, { Component } from 'react';
import * as firebase from 'firebase';

class ProjectSubmissionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    const changes = {};

    changes[inputName] = inputValue;

    this.setState(changes);
  }

  handleSubmit = (event) => {

    event.preventDefault();

    var pName = this.state.projectName;
    var pCoId = this.state.postingCompanyId;
    var pProId = this.state.professionID;

    var newProjectKey = firebase.database().ref().child('projects').push().key;
    // Adds project to database
    firebase.database().ref('/projects/' + newProjectKey).set({
        name: pName,
        posting_company: pCoId,
        profession_type: pProId
    });   
  }

  render() {
    return (
      <form>
        <h2>Add a Project</h2>
        <label>
          Project Name:
          <input name="projectName" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Posting Company ID:
          <input name="postingCompanyId" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Profession Type ID:
          <input name="professionID" type="text" onChange={this.handleInputChange} />
        </label>
        <button onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default ProjectSubmissionForm;