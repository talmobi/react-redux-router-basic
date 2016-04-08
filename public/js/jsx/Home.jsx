var React = require('react');

var Scanner = require('./Scanner.jsx');

var Component = React.createClass({
  render: function () {
    var store = this.props.store;
    console.log("home: " + store);

    var str = (new Date()).toString();

    return (
      <div>
        Home: {str}
        <hr />
        <Scanner store={store} />
      </div>
    );
  }
});

module.exports = Component;
