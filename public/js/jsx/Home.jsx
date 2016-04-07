var React = require('react');

var Component = React.createClass({
  render: function () {
    var store = this.props.store;
    console.log("home: " + store);

    var str = (new Date()).toString();

    return (
      <div>
        Home: {str}
      </div>
    );
  }
});

module.exports = Component;
