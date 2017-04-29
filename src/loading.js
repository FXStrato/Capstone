import React, { Component } from 'react';
/* Home will be the landing page for the application. */

class Loading extends Component {

  componentDidMount = () => {
    
  }

  render() {
    return (
        <div className="loadingScreen">
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
        </div>
    );
  }
}

export default Loading;
