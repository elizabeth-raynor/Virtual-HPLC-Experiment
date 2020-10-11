import React from 'react';

import './single/add-solvent.css';

const percentageArray = ["15%", "35%", "50%", "65%", "85%"];

class App extends React.Component {

  state = {
    percentageIndex: 4
  }

  increasePercentage = () => {
    let { percentageIndex } = this.state;
    percentageIndex += 1;
    if (percentageIndex > 4) {
      percentageIndex = 4;
    }
    this.setState({ percentageIndex });
  }

  decreasePercentage = () => {
    let { percentageIndex } = this.state;
    percentageIndex -= 1;
    if (percentageIndex < 0) {
      percentageIndex = 0;
    }
    this.setState({ percentageIndex });
  }

  render() {    
    return (
      <div>
        <button className="Arrow" onClick={this.increasePercentage}/>
          {percentageArray[this.state.percentageIndex]}
        <button className="Arrow" onClick={this.decreasePercentage}/>

      </div>
    )
  } 
}

export default App
