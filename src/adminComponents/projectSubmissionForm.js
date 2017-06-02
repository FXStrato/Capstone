/*eslint no-unused-vars: "off"*/ //don't show warnings for unused
import React, { Component } from 'react';
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { DatePicker } from 'material-ui';
import moment from 'moment';

class ProjectSubmissionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  formatDate = (date) => {
    return moment(date).format('ddd, MMMM D YYYY');
  }

  handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    const changes = {};

    changes[inputName] = inputValue;

    this.setState(changes);
  }

  handleSubmissionDate = (subDate) => {
    this.setState({dueDate: this.formatDate(subDate)});
  }

  handlePostDate = (subDate) => {
    this.setState({postingDate: this.formatDate(subDate)});
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
    var theTags = this.state.tagsList.split(",");
    var diff = this.state.difficulty;

    // Testing variables

    var supportingCompanies = ["-Kgl0j0pOVUWZdrczJXB","-KglpkMFxCoiFyr_vt_x"];
    var additionalResources = ["Here's a great list of sample design projects: http://www.creativebloq.com/portfolios/examples-712368", "InVision outlines fantastic tips on what to consider about your portfolio project: https://www.invisionapp.com/blog/building-a-design-portfolio/", "Build a solid foundation for Design: http://vanseodesign.com/downloads/learn-design-fundamentals/"];
    var submissionRequirements = ["Create some form of a case study where employers can evaluate your reasoning and the sequential steps you took", "Include a reflection on creating this project", "The experience must allow for a single user to use it (it cannot be a multiplayer-only experience)", "Submission format must be a URL link or one of the following file types: pdf, psd, ai, sketch, png."];
    var exScope = {
      "platform":[
        "Mobile","Desktop","Tablet","Virtual Reality","Augmented Reality / Mixed Reality"
      ],
      "personas":[{
        "name":"Alice",
        "title": "The Newly Wed",
        "age": "29",
        "location":"Downtown Seattle, WA",
        "employment":"Journalist",
        "income":"$50,000 / year",
        "brands":["Lululemon","Nike","BBC","National Geographic"],
        "biography":"Alice just celebrated her 1-year marriage anniversary to her highschool sweetheart, Eric. The young couple has been eagerly talking about having a child soon, but want to move out of their one bedroom apartment and buy a home before they have a baby. Spunky and excited, Alice has been saving money for the past half-decade just for the down payment for the mortgage. Between her and Eric’s combined income, they make roughly $160,00 a year. They are heavily prioritizing good schools, safe neighborhoods, & affordability."
      },{
        "name":"Roger",
        "title": "The Downsizer",
        "age": "72",
        "location":"Suburbs of Boston, MA",
        "employment":"Retired, with passive income rental properties",
        "income":"$40,000 / year",
        "brands":["Lululemon","Nike","BBC","National Geographic"],
        "biography":"Roger was a long-time top salesmen in the North Eastern region who hung up his hat a couple years ago to retire with his wife, Susan. Now that all their kids have left the house (with their eldest now a top saleswoman in the North Easter region herself) they want to sell the ol’ faithful family house and live closer to the city, where their kids & families are. Roger and Susan have money saved, along with an apartment building that gives them passive income."
      }],
      "use_cases":["Find a new home with an intent to purcahse for oneself","Peruse a map to find interesting properties for investors"]
    };

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
        cover_image_link: coverImage,
        scope:exScope,
        tags: theTags,
        difficulty: diff
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
          Difficulty:
          <input name="difficulty" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Tags
          <input name="tagsList" type="text" onChange={this.handleInputChange} />
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
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <DatePicker
            hintText="Posting Date"
            firstDayOfWeek={0}
            container="inline"
            formatDate={this.formatDate}
            onChange={(n, date) => {this.handlePostDate(date)}}
          />
        </MuiThemeProvider>
        <br />
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <DatePicker
            hintText="Submission Due Date"
            firstDayOfWeek={0}
            container="inline"
            formatDate={this.formatDate}
            onChange={(n, date) => {this.handleSubmissionDate(date)}}
          />
        </MuiThemeProvider>
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
