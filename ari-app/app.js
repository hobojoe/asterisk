/*jshint node:true*/
var ari = require('ari-client')

var dialogs = [];

async function main(){
  
  const client = await ari.connect('http://asterisk:8088', 'asterisk', 'asterisk');

  // handler for StasisStart event
  async function stasisStart(event, channel) {
    
    console.log(event);
    if(event.channel.state != 'Down'){      
      const dialed = await client.channels.create({
        endpoint: `PJSIP/${event.channel.dialplan.exten}`,
        app: 'ari-app',
        appArgs: 'dialed'
      });

      let bridge = client.Bridge();

      bridge = await bridge.create();
      console.log(dialed.id);
      await bridge.addChannel({channel: [channel.id, dialed.id]});

      await client.channels.dial({ channelId: dialed.id});

    }
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

