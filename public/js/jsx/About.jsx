var React = require('react');

var Component = React.createClass({
  render: function () {
    var store = this.props.store;
    console.log("about: " + store);

    return (
      <div>
        About
      </div>
    );
  }
});

module.exports = Component;
