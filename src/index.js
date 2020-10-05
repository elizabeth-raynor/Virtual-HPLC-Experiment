import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import App from './App'
import ThirdLab from './thirdlab'
import SecondLab from './secondlab'
import Notfound from './notfound'

const routing = (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/secondlab">Second</Link>
        </li>
        <li>
          <Link to="/thirdlab">Third</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/" component={App} />        
        <Route path="/secondlab" component={SecondLab} />
        <Route path="/thirdlab" component={ThirdLab} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))