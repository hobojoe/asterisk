var client = require('ari-client')
client.connect('http://asterisk:8088', 'asterisk', 'asterisk', clientLoaded);

function clientLoaded (err, client) {
    if (err) {
      throw err;
    }
    // handler for StasisStart event
    function stasisStart(event, channel) {
      // ensure the channel is not a dialed channel
      console.log("Statis Start!!!!", event);
      
    }
  
    client.on('StasisStart', stasisStart);
  
    client.start('ari-app');
  }