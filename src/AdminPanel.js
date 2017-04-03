import React, { Component } from 'react';
import * as firebase from 'firebase';
import CompanyForm from './adminComponents/companySubmissionForm';

class AdminPanel extends Component {
    render() {
        return (
            <CompanyForm></CompanyForm>
        );
    }

    addCompany(companyName,logoFile){
        // Generate a unique company key
        var newCompanyKey = firebase.database().ref().child('companies').push().key;

        console.log(newCompanyKey);
        console.log(logoFile);

        // Upload the logo file to Firebase storage, naming it the key of the company
        var storageReference = firebase.storage().ref('company_logos/' + newCompanyKey);
        var task = storageReference.put(logoFile);

        // Check for when the logo is finished uploading
        task.on('state_changed',
            function complete(){
                // Add the new company to the database
                firebase.database().ref('/companies' + newCompanyKey).set({
                    name: companyName
                });
            }
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