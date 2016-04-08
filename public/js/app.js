var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');

var deepFreeze = require('deep-freeze');

if (location.hostname.indexOf('local') >= 0) {
  window.debug = true;
}

// set inital store state
var initialState = {
  barcodes: [],
  control_command_names: {
    "111": "Maintenance",
    "222": "Export",
    "333": "Exit",
    "448": "Finish",
    "444": "Scan",
    "455": "Clear",
    "446": "Remove",
    "002": "OK",
    "447": "Canel",
    "559": "Back"
  },
  control_command_actions: {
    "111": "Maintenance",
    "222": "Export",
    "333": "Exit",
    "448": "Finish",
    "444": "Scan",
    "455": "Clear",
    "446": "Remove",
    "002": "OK",
    "447": "Canel",
    "559": "Back"
  }
};

deepFreeze( initialState );

initialState = Object.assign({}, initialState, {
  barcodes: initialState.barcodes.concat(["sucess"])
});

var mainReducer = function (state = initialState, action) {
  switch (action.type) {
    case 'CONTROL_COMMAND_CANCEL':
        return Object.assign({}, state, {
          barcodes: state.barcodes.slice(0, state.barcodes.length - 1)
        });
      break;
    default:
      return state;
  }
};

var store = Redux.createStore( mainReducer );

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { routerHistory } from 'react-router'; // works with Cordova/PhoneGap
// NOTE! browserHistory does not work with Cordova/PhoneGap, use routerHistory

var App = require('./jsx/App.jsx');
var Home = require('./jsx/Home.jsx');
var About = require('./jsx/About.jsx');
var NoMatch = require('./jsx/NoMatch.jsx');

// custom creation fn to pass down store as props to every component
var createElement = function (Component, props) {
  return <Component store={store} {...props} />
};

ReactDOM.render((
  <Router history={ routerHistory } createElement={createElement}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>
), document.getElementById('app'));

console.log("App loaded!");
