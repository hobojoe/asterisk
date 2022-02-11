/*jshint node:true*/
var ari = require('ari-client');



async function main() {
  const client = await ari.connect('http://asterisk:8088', 'asterisk', 'asterisk');

  // handler for StasisStart event
  async function stasisStart(event, channel) {
    // console.log('ligou', event);
    if (event.args[0] != 'dialed') {
      await makeCall(channel, event.channel.dialplan.exten, client)
    }
  }

  client.on('StasisStart', stasisStart);
  client.start('ari-app');
}

async function makeCall(origem, extension, client) {
  const dialed = await client.channels.create({
    endpoint: `PJSIP/${extension}`,
    app: 'ari-app',
    appArgs: 'dialed'
  });

  origem.on('StasisEnd', async function (event, channel) {
    await hangup(dialed);
  });

  dialed.on('ChannelDestroyed', async function (event, channel) {
    await hangup(origem);
  });


  // console.log('bridge', bridge);
  // client.bridges.record({
  //   bridgeId: bridge.id, 
  //   format: "wav", 
  //   name: "testeluciano"
  // })
  let bridge = client.Bridge();
  bridge = await bridge.create({ type: 'mixing' });

  dialed.on('ChannelStateChange', async function (evento, canal) {
    console.log('canal', [origem.id, canal.id]);
    console.log('canal estado', canal.state)

    if (canal.state == "Up") {
      console.log('up', canal.state)
      await bridge.addChannel({ channel: canal.id });
    }
  });

  await bridge.addChannel({ channel: origem.id });

  await bridge.startMoh();
  // await client.channels.dial({ channelId: dialed.id });
}


async function hangup(channel) {
  try {
    await channel.hangup();
  } catch (e) {

  }
}


(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();

