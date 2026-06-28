// Basic web -> output monitor - 24127493
// Input MQTT: smartdry/rack/status
// Purpose: normalize ESP32 motor state after it receives web commands.

const payload = msg.payload || {};
const now = new Date().toISOString();

const normalized = {
  kind: 'rack_status',
  deviceId: payload.deviceId || 'smartdry-01',
  state: payload.state || 'unknown',
  target: payload.target || 'none',
  motorRunning: Boolean(payload.motorRunning),
  reason: payload.reason || 'not_provided',
  espTimestamp: payload.timestamp || null,
  serverTime: now
};

flow.set('latestRack', normalized);

msg.payload = normalized;
msg.firestore = {
  collection: 'rack_events',
  document: normalized
};

return msg;

