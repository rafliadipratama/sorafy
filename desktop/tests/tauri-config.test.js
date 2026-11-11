const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const TAURI_CONF_PATH = path.join(__dirname, '../src-tauri/tauri.conf.json');
const CAPABILITIES_DEFAULT_PATH = path.join(__dirname, '../src-tauri/capabilities/default.json');

test('tauri.conf.json exists and parses valid JSON with required window dimensions and global tauri bridge', () => {
  assert.ok(fs.existsSync(TAURI_CONF_PATH), 'tauri.conf.json should exist');
  const raw = fs.readFileSync(TAURI_CONF_PATH, 'utf8');
  const config = JSON.parse(raw);

  assert.ok(config && typeof config === 'object', 'parsed config should be an object');
  assert.strictEqual(config.app?.withGlobalTauri, true, 'app.withGlobalTauri should be true');

  assert.ok(Array.isArray(config.app?.windows) && config.app.windows.length > 0, 'app.windows should be non-empty array');
  const mainWindow = config.app.windows[0];

  assert.strictEqual(mainWindow.label, 'main', 'app.windows[0].label should be "main"');
  assert.strictEqual(mainWindow.width, 1280, 'app.windows[0].width should be 1280');
  assert.strictEqual(mainWindow.height, 840, 'app.windows[0].height should be 840');
  assert.strictEqual(mainWindow.minWidth, 960, 'app.windows[0].minWidth should be 960');
  assert.strictEqual(mainWindow.minHeight, 640, 'app.windows[0].minHeight should be 640');
  assert.strictEqual(mainWindow.backgroundColor, '#0B0D10', 'app.windows[0].backgroundColor should be "#0B0D10"');

  assert.ok(Array.isArray(config.app?.security?.capabilities), 'app.security.capabilities should be an array');
  assert.ok(config.app.security.capabilities.includes('default'), 'app.security.capabilities should contain "default"');
});

test('capabilities/default.json exists and parses valid JSON with core permissions for main window', () => {
  assert.ok(fs.existsSync(CAPABILITIES_DEFAULT_PATH), 'capabilities/default.json should exist');
  const raw = fs.readFileSync(CAPABILITIES_DEFAULT_PATH, 'utf8');
  const cap = JSON.parse(raw);

  assert.ok(cap && typeof cap === 'object', 'parsed capabilities should be an object');
  assert.ok(Array.isArray(cap.windows), 'capabilities.windows should be an array');
  assert.ok(cap.windows.includes('main'), 'capabilities.windows should include "main"');

  assert.ok(Array.isArray(cap.permissions), 'capabilities.permissions should be an array');
  assert.ok(cap.permissions.includes('core:default'), 'capabilities.permissions should include "core:default"');
});
