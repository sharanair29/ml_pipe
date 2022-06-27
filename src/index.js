import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import constants from './config/constants'
import SimpleNav from './components/SimpleNav';


import App from './App';

import{
  Switch,
  Route,
  BrowserRouter as Router
} from "react-router-dom"
import reportWebVitals from './reportWebVitals';
import ImageClassificationDemo from './pages/ImageClassificationDemo';
import ClassificationUploader from './pages/ClassificationUploader';
import AutoClassification from './pages/AutoClassification';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDemo from './pages/UserDemo';

ReactDOM.render(
  <React.Fragment>
    <SimpleNav />
    <Router>
      <Switch>
        <Route path="/userDemo" component={UserDemo}/>
        <Route path="/autoClassification" component={AutoClassification}/>
        <Route path="/classificationUploader" component={ClassificationUploader}/>
        <Route path="/classificationDemo" component={ImageClassificationDemo} />
        <Route path="/" component={UserDemo} />
      </Switch>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
