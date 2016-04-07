var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');

var mainReducer = function (state, action) {
  switch (action.type) {
    default:
      return state;
  }
};

var store = Redux.createStore( mainReducer );

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

var App = require('./jsx/App.jsx');
var Home = require('./jsx/Home.jsx');
var About = require('./jsx/About.jsx');
var NoMatch = require('./jsx/NoMatch.jsx');

// custom creation fn to pass down store as props to every component
var createElement = function (Component, props) {
  return <Component store={store} {...props} />
};

ReactDOM.render((
  <Router history={browserHistory} createElement={createElement}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>
), document.getElementById('app'));

console.log("App loaded!");
