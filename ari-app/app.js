/*jshint node:true*/
var ari = require('ari-client');


async function main(){
  const client = await ari.connect('http://asterisk:8088', 'asterisk', 'asterisk');

  // handler for StasisStart event
  async function stasisStart(event, channel) {
    if(event.args[0] != 'dialed'){      
      await makeCall(channel, event.channel.dialplan.exten, client)
    }
  }
  
  client.on('StasisStart', stasisStart);
  client.start('ari-app');
}

async function makeCall(origem, extension, client){
  const dialed = await client.channels.create({
    endpoint: `PJSIP/${extension}`,
    app: 'ari-app',
    appArgs: 'dialed'
  });

  origem.on('StasisEnd', async function(event, channel) {
    await hangup(dialed);
  });

  dialed.on('ChannelDestroyed', async function(event, channel) {
    await hangup(origem);
  });

  let bridge = client.Bridge();
  bridge = await bridge.create();
  await bridge.addChannel({channel: [origem.id, dialed.id]});

  await client.channels.dial({ channelId: dialed.id});
}


async function hangup(channel) {
  try{
    await channel.hangup();
  }catch(e){

  }
}


(async () => {
  try {
      await main();
  } catch (e) {
      console.error(e);
  }
})();

