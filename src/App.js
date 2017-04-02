import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          Header navigation
        </header>
        <main>
          {this.props.children}
        </main>
        <footer>
          Footer
        </footer>
      </div>
    );
  }
}

export default App;
