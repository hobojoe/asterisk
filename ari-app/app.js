/*jshint node:true*/
var ari = require('ari-client')

async function main(){
  
  const client = await ari.connect('http://asterisk:8088', 'asterisk', 'asterisk');

  // handler for StasisStart event
  async function stasisStart(event, channel) {
    
    if(event.appArgs[0] != 'dialed'){      
      await call(channel, event.channel.dialplan.exten)
    }
  }
  
  client.on('StasisStart', stasisStart);
  client.start('ari-app');
}

async function call(origem, extension){
  const dialed = await client.channels.create({
    endpoint: `PJSIP/${extension}`,
    app: 'ari-app',
    appArgs: 'dialed'
  });

  let bridge = client.Bridge();

  bridge = await bridge.create();
  await bridge.addChannel({channel: [origem.id, dialed.id]});

  await client.channels.dial({ channelId: dialed.id});
}


(async () => {
  try {
      await main();
  } catch (e) {
      console.error(e);
  }
})();

