var React = require('react');

var debug = window.debug;

var BarcodeGunDevice = React.createClass({
  componentDidMount: function () {
    var self = this; // closure
    var addScan = this.props.addScan;
    // run script to keep the input focus (for the barcode gun)
    var inputEl = this.refs['barcode-gun-input']; // grab dom element from refs

    // poll to focus input
    document.addEventListener('DOMContentLoaded', function () {
      console.log("DOM CONTENT LOADED");
      inputEl.focus();
    });

    // this input el not necessarily necessary..
    setInterval(function () {
      if (document.activeElement != inputEl) {
        console.log("interval: re-focusing barcode gun input element");
        inputEl.focus();
      }
    }, 1000);

    var timeout = null;
    inputEl.oninput = document.onkeyup = window.onkeypress = function (e) {
      // check if it's a number (probably a barcode)
      // and focus the input element if it is not focused
      if (e.which !== 0 && !inputEl.activeElement) {
        console.log("focusing input");
        inputEl.focus();

        // kick off settimeout to grab the input value
        if (timeout) { // clear last
          clearTimeout( timeout );
        }
        timeout = setTimeout(function () {
          var barcode = inputEl.value;
          self.props.addScan({
            text: barcode
          })
          inputEl.value = "";
        }, 200);
      }
    };

    // TODO Test, delete this
    setTimeout(function () {
      for (var i = 0; i < 5; i++) {
        var code = 1000 + Math.floor(Math.random() * 10) * 10;
        addScan({text: code});
      };
    }, 2000);

    setTimeout(function () {
      // is fired on Cordova Android
      //alert("--TEST BARCODES ADDED--");
    }, 3000);
  },
  render: function () {
    return (
      <div className="barcode-gun-container">
        <input ref="barcode-gun-input" />
      </div>
    );
  }
});

var unsubscribe = null;
var Component = React.createClass({
  getInitialState: function () {
    // NOTE! use redux instead?
    return {
      scans: []
    }
  },
  componentDidMount: function () {
    var self = this; // closeu
    var store = this.props.store;
    // add top level redux store listener
    unsubscribe = store.subscribe(function () {
      var currentState = store.getState();

      console.log("Scanner subscription callback");

      // also re-renders after setting state
      self.setState({
        scans: currentState.barcodes.slice()
      });
    });
  },
  componentDidUnmount: function () {
    console.log("SCANNER UNMOUNTED");
    unsubscribe();
  },
  // result {text}
  addScan: function (result) {
    // use redux, dispatch event for a new scan
    var store = this.props.store;
    store.dispatch({ type: 'ADD_SCAN', code: result.text });

    /* Using redux instead
    // result is a cordova.barcodeScanner plugin object
    var scan = {
      code: result.text,
      created_at: Date.now()
    };
    this.setState({
      scans: this.state.scans.concat([scan])
    });
    */
    /* You could do this instead 
     * NOTE: But it is NOT recommended, since state
     * should be treated as it if were immutable!! (like redux)
     *
     * this.state.scans.push( scan );
     * this.forceUpdate(); // re-render the component
     * */
  },
  handleStartScan: function () {
    var self = this; // closure

    try {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          //alert("result: " + result.text);
          self.addScan(result);
        },
        function (error) {
          alert("scanning failed: " + error);
        }
      );
    } catch (err) {
      if (!debug) {
        alert("Barcode Scan failed. Not running Crodova?: " + err);
      } else {
        // populate with random test bogus codes
        var n = 100 + 100 * Math.random() + 1000 * Math.floor(10 * Math.random());
        self.addScan({text: "" + (n | 0)});
      }
    }
  },
  handleSendToCloud: function () {
    // TODO
    var self = this; // closure

    var scans = this.state.scans.slice();

    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzAyNDc0OTVlZDg4Njg3NjEyZTE0YWUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE0NjAwMzYxNDYsImV4cCI6MTQ2MDA1NDE0Nn0.CUeB3Auy6mQ7RVARBWrYIDggVT_2dd6otKwzZXt613I";

    var _sendToCloud = function () {
      var req = new XMLHttpRequest();
      var root = "http://80.242.18.248:12000";
      var path = "/api/jobs";
      var uri = root + path;
      req.open('POST', uri, true);

      req.setRequestHeader('token', token);

      req.onload = function () {
        if (req.status >= 200 && req.status < 400) {
          console.log("xhr success: " + req.status);
          try {
            var data = JSON.parse(req.responseText);
            console.log(data);
          } catch (err) {
            console.log(req.responseText.slice(0, 60) + "...");
          }
        } else {
          console.log("xhr failed: " + req.status);
          //console.log(req.responseText.slice(0, 60) + "...");
          setTimeout(function () {
            console.log(req.responseText);
          }, 2000);
        }
      }

      req.onerror = function () {
        console.log("xhr error");
      }

      req.setRequestHeader('Content-Type', 'application/json');
      var data = {
        email: "admin@example.com",
        password: "admin"
      };
      req.send( JSON.stringify(data) );
    }

    _sendToCloud();

  },
  render: function () {
    console.log("SCANNER REACT RENDERED");
    var store = this.props.store;
    //console.log("scanner store: " + store);

    var str = (new Date()).toString();

    var scans = this.state.scans;

    // map scans into react components
    var list = scans.map(function (val, ind, arr) {
      var code = val.code;
      return (
        <li key={ind} className="li-barcode">
          <span className="barcode">{code}</span>
        </li>
      );
    });

    return (
      <div>
        <button onClick={this.handleStartScan} className="large-button">START SCAN</button>
        <button onClick={this.handleSendToCloud} className="large-button">SEND TO CLOUD</button>
        <hr />
        <BarcodeGunDevice store={this.props.store} addScan={this.addScan} />
        <hr />
        <ul className="ul-barcode">
          {list}
        </ul>
      </div>
    );
  }
});

module.exports = Component;

