import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import firebase from 'firebase';
import CompanyForm from './adminComponents/companySubmissionForm';
import ProjectForm from './adminComponents/projectSubmissionForm';

class AdminPanel extends Component {

    test(){
        console.log(this.props.userID);
    }

    render() {
        return (
            <div className="container">
                <Row>
                    <Col m={4}>
                        <CompanyForm></CompanyForm>
                    </Col>
                    <Col m={4}>
                        <ProjectForm></ProjectForm>
                    </Col>
                    <Col m={4}>
                        <button onClick={this.test}>Add Projects to User</button>
                    </Col>
                </Row>
                
                
            </div>
        );
    }
}

export default AdminPanel;