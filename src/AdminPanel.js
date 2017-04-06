import React, { Component } from 'react';
import * as firebase from 'firebase';
import CompanyForm from './adminComponents/companySubmissionForm';
import ProjectForm from './adminComponents/projectSubmissionForm';

class AdminPanel extends Component {
    render() {
        return (
            <div className="container">
                <CompanyForm></CompanyForm>
                <ProjectForm></ProjectForm>
            </div>
        );
    }

    addProject(projectName,postingCompany,professionTypeID){
        // Generate a unique project key
        var newProjectKey = firebase.database().ref().child('projects').push().key;
        // Adds project to database
        firebase.database().ref('/projects' + newProjectKey).set({
            name: projectName,
            posting_company: postingCompany,
            profession_type: professionTypeID
        });
    }

    addProfession(professionName){
        // Generate a unique profession key
        var newProfessionKey = firebase.database().ref().child('professions').push().key;
        // Adds profession to database
        firebase.database().ref('/professions' + newProfessionKey).set({
            name: professionName
        });
    }
}

export default AdminPanel;