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

    var one_Liner = this.state.oneLiner;
    var shortDescription = this.state.shortDesc;
    var posting_Date = this.state.postingDate;
    var due = this.state.dueDate;
    var estDur = this.state.estimatedDuration;
    var coverImage = this.state.coverImageLink;

    // Testing variables

    var supportingCompanies = ["-Kgl0j0pOVUWZdrczJXB","-KglpkMFxCoiFyr_vt_x"];
    var additionalResources = ["Check out this link: https://www.google.com/", "A great resources for memes: https://www.reddit.com/r/AskReddit/"];
    var submissionRequirements = ["Must be mobile responsive", "Please add colors to show off visual design"];

    var newProjectKey = firebase.database().ref().child('projects').push().key;
    // Adds project to database
    firebase.database().ref('/projects/' + newProjectKey).set({
        name: pName,
        posting_company: pCoId,
        profession_type: pProId,
        one_liner: one_Liner,
        short_description: shortDescription,
        posting_date: posting_Date,
        due_date: due,
        estimated_duration: estDur,
        supporting_companies: supportingCompanies,
        additional_resources: additionalResources,
        submission_requirements: submissionRequirements,
        cover_image_link: coverImage
    });     
  }

  render() {
    return (
      <form>
        <h4>Add a Project</h4>
        <label>
          Project Title:
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
        <label>
          One Liner:
          <input name="oneLiner" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Short Description:
          <input name="shortDesc" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Cover Image Link:
          <input name="coverImageLink" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        {/*<label>
          Supporting Company ID's:
          <input name="postingCompanyId" type="text" onChange={this.handleInputChange} />
        </label>
        <br />*/}
        {/*<label>
          Additional Resources:
          <input name="postingCompanyId" type="text" onChange={this.handleInputChange} />
        </label>
        <br />*/}
        <label>
          Posting Date:
          <input name="postingDate" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Submission Due Date:
          <input name="dueDate" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        {/*<label>
          Submission Requirements:
          <input name="postingCompanyId" type="text" onChange={this.handleInputChange} />
        </label>
        <br />*/}
        <label>
          Estimated Duration:
          <input name="estimatedDuration" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <button onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default ProjectSubmissionForm;