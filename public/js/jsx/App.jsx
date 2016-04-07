var React = require('react');

import { Link } from 'react-router';

var Component = React.createClass({
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
