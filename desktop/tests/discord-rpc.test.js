const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createClient(clientId = '123456789012345678') {
  const source = fs.readFileSync(path.join(__dirname, '../electron-main.js'), 'utf8');
  const sockets = [];
  const timers = new Set();
  const settings = { discordRpc: true };
  const context = {
    Buffer, process: { ...process, env: { ...process.env, DISCORD_CLIENT_ID: clientId } }, path, fs,
    console: { log() {}, warn() {} },
    loadAppSettings: () => settings,
    setTimeout: (fn) => { timers.add(fn); return fn; },
    clearTimeout: (fn) => timers.delete(fn),
    net: { connect() {
      const socket = new EventEmitter();
      socket.packets = [];
      socket.write = packet => socket.packets.push(JSON.parse(packet.subarray(8).toString()));
      socket.destroy = () => { socket.destroyed = true; };
      socket.end = () => { socket.ended = true; };
      sockets.push(socket);
      return socket;
    } }
  };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('class DiscordRpcClient {'), source.indexOf('const discordRpc =')) + '\nglobalThis.client = new DiscordRpcClient();', context);
  context.client.getCandidateSocketPaths = () => ['first', 'second'];
  return { client: context.client, sockets, timers, settings };
}

function ready(socket) {
  socket.emit('connect');
  const body = Buffer.from(JSON.stringify({ evt: 'READY' }));
  const header = Buffer.alloc(8);
  header.writeInt32LE(1);
  header.writeInt32LE(body.length, 4);
  socket.emit('data', Buffer.concat([header, body]));
}

test('handshake uses the environment ID and ignores an old settings override', () => {
  const { client, sockets, settings } = createClient(' 234567890123456789 ');
  settings.discordClientId = '345678901234567890';
  client.connect();
  ready(sockets[0]);
  assert.equal(sockets[0].packets[0].client_id, '234567890123456789');
});

test('missing or invalid environment ID leaves RPC disconnected', () => {
  for (const value of ['', 'not-an-id', '123']) {
    const { client, sockets, timers } = createClient(value);
    client.setActivity({ type: 2, name: 'Music' });
    assert.equal(client.getClientId(), null);
    assert.equal(sockets.length, 0);
    assert.equal(timers.size, 0);
  }
});

test('listening name and display field survive serialization and wait for READY', () => {
  const { client, sockets } = createClient();
  client.setActivity({ type: 2, name: 'Music', status_display_type: 1, details: 'Helena', state: 'My Chemical Romance' });
  assert.equal(sockets[0].packets.length, 0);
  ready(sockets[0]);
  const activity = sockets[0].packets.at(-1).args.activity;
  assert.equal(activity.type, 2);
  assert.equal(activity.name, 'Music');
  assert.equal(activity.status_display_type, 1);
  assert.equal(activity.details, 'Helena');
  assert.equal(activity.state, 'My Chemical Romance');
});

test('disconnect clears activity and a late close does not reconnect', () => {
  const { client, sockets, timers } = createClient();
  client.setActivity({ type: 2, name: 'Sorafy' });
  ready(sockets[0]);
  client.disconnect();
  assert.equal(sockets[0].packets.at(-1).args.activity, null);
  assert.equal(sockets[0].ended, true);
  sockets[0].emit('close');
  assert.equal(client.currentActivity, null);
  assert.equal(client.socket, null);
  assert.equal(timers.size, 0);
});

test('disabling during connection ignores late connect, close, and error events', () => {
  const { client, sockets, timers, settings } = createClient();
  client.connect();
  settings.discordRpc = false;
  client.disconnect();
  ready(sockets[0]);
  sockets[0].emit('error', new Error('closed'));
  sockets[0].emit('close');
  client.connect();
  assert.equal(client.isConnected, false);
  assert.equal(sockets.length, 1);
  assert.equal(timers.size, 0);
});

test('failed socket close cannot reset a successful fallback connection', () => {
  const { client, sockets, timers } = createClient();
  client.connect();
  sockets[0].emit('error', new Error('unavailable'));
  ready(sockets[1]);
  sockets[0].emit('close');
  assert.equal(client.socket, sockets[1]);
  assert.equal(client.isReady, true);
  assert.equal(timers.size, 0);
});

test('clearing pending activity prevents replay after reconnect', () => {
  const { client, sockets } = createClient();
  client.clearActivity();
  assert.equal(sockets.length, 0);
  client.setActivity({ type: 2, name: 'Music' });
  client.clearActivity();
  ready(sockets[0]);
  assert.equal(sockets[0].packets.some(p => p.cmd === 'SET_ACTIVITY'), false);
});
