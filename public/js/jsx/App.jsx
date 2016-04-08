var React = require('react');

import { Link } from 'react-router';

var Component = React.createClass({
  componentDidMount: function () {
    var self = this; // closeu
    var store = this.props.store;
    // add top level redux store listener
    var unsubscribe = store.subscribe(function () {
      var currentState = store.getState(); // unused currently

      console.log("App subscription callback");

      // re-render, react does it optimally
      self.forceUpdate();
    });
  },
  render: function () {
    var store = this.props.store;
    console.log("app: " + store);

    console.log( this.props.children );

    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        { this.props.children }
      </div>
    );
  }
});

module.exports = Component;
