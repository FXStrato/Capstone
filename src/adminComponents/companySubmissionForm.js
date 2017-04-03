import React, { Component } from 'react';
import * as firebase from 'firebase';

class CompanySubmissionForm extends Component {
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

    var cName = this.state.companyName;
    var cLogo = this.state.companyLogo;

    // Generate a unique company key
    var newCompanyKey = firebase.database().ref().child('companies').push().key;

    firebase.database().ref('/companies/' + newCompanyKey).set({
        name: cName
    });

    // Upload the logo file to Firebase storage, naming it the key of the company
    // var storageReference = firebase.storage().ref('company_logos/' + newCompanyKey);
    // var task = storageReference.put(cLogo);

    // Check for when the logo is finished uploading
    // task.on('state_changed',
    //     function complete(){
    //         alert('file uploaded!');
    //     }
    // );
      
    //   console.log(cLogo);
  }

  render() {
    return (
      <form>
        <h2>Add a Company</h2>
        <label>
          Company Name:
          <input name="companyName" type="text" onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Logo Upload:<br />
          <input name="companyLogo" type="file" onChange={this.handleInputChange} />
        </label>
        <button onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default CompanySubmissionForm;