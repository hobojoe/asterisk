/*jshint node:true*/
var ari = require('ari-client')


async function main(){
  
  const client = await ari.connect('http://asterisk:8088', 'asterisk', 'asterisk');

  // handler for StasisStart event
  function stasisStart(event, channel) {
    // ensure the channel is not a dialed channel
    console.log("Statis Start!!!!", event);
    

    var dialed = client.Channel();

    client.channels.create({
      
    })

  }

  client.on('StasisStart', stasisStart);

  client.start('ari-app');
}


(async () => {
  try {
      await main();
  } catch (e) {
      console.error(e);
  }
})();

