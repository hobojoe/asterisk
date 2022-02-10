/*jshint node:true*/
var ari = require('ari-client')

var dialogs = [];

async function main(){
  
  const client = await ari.connect('http://asterisk:8088', 'asterisk', 'asterisk');

  // handler for StasisStart event
  async function stasisStart(event, channel) {
    
    // ensure the channel is not a dialed channel
    // console.log("Statis Start!!!!", event);
    console.log(event);
    if(event.channel.state != 'Down'){      
      const dialed = await client.channels.create({
        endpoint: `PJSIP/${event.channel.dialplan.exten}`,
        app: 'ari-app',
        appArgs: 'dialed'
      });

      // for (const key in dialed) {
      //   if(dialed.hasOwnProperty(key))
      //     console.log(dialed[key]);
      // }

      //colocar en un bridge

      let bridge = client.Bridge();

      bridge = await bridge.create();

      await bridge.addChannel({channel: [channel.id, dialed.id]});

      await client.channels.dial({ channelId: dialed.id});

      await channel.answer();
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

