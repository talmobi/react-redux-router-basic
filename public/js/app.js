var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');

var deepFreeze = require('deep-freeze');

var extend = require('extend');

// Cordova Android does not support Object.assign - use extend library
Object = Object || {};
Object.assign = extend;

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
    "447": "Cancel",
    "559": "Back"
  },
  control_command_actions: {
    "111": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "222": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "333": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "448": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "444": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "455": "CLEAR_ALL", // TEST ONLY - NOT FINAL
    "446": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "002": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "447": "CONTROL_COMMAND_PRINT_NAME_ONLY",
    "559": "REMOVE_LAST_SCAN" // TEST ONLY - NOT FINAL!!
  }
};

deepFreeze( initialState );

//initialState = Object.assign({}, initialState, {
//  barcodes: initialState.barcodes.concat(["sucess"])
//});

var mainReducer = function (state = initialState, action) {
  console.log("inside mainReducer function (redux)");
  switch (action.type) {
    case 'CONTROL_COMMAND_CANCEL':
        return Object.assign({}, state, {
          barcodes: state.barcodes.slice(0, state.barcodes.length - 1)
        });
      break;

    case 'ADD_SCAN':
        //alert("--TEST STORE.DISPATCH ADD_SCAN--");
        var scan = {
          code: action.code,
          type: action.type,
          created_at: Date.now()
        };
        console.log("scan: " + scan);
        console.log("ADD_SCAN dispatched. barcodes.length was: " + state.barcodes.length);
        return Object.assign({}, state, {
          barcodes: state.barcodes.concat([scan])
        });
      break;

    case 'CLEAR_ALL':
        return Object.assign({}, state, {
          barcodes: []
        });
      break;

    case 'REMOVE_LAST_SCAN':
        return Object.assign({}, state, {
          barcodes: state.barcodes.slice( 0, state.barcodes.length - 1 )
        });
      break;

    case 'CONTROL_COMMAND_PRINT_NAME_ONLY':
        var scan = {
          code: action.code,
          type: action.type,
          name: action.name,
          created_at: Date.now()
        };
        return Object.assign({}, state, {
          barcodes: state.barcodes.concat([scan])
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
