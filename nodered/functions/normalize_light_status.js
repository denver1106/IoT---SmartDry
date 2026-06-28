// Task 1 monitor - 24127493
// Input MQTT: smartdry/task1/light-led
// Purpose: SmartDry's Task 1 is handled locally on ESP32 (LDR -> LED).
// Node-RED records the result so the team can show proof on web/cloud.

const payload = msg.payload || {};
const now = new Date().toISOString();

const lightRaw = Number(payload.lightRaw);
const dark = Boolean(payload.dark);
const ledOn = Boolean(payload.ledOn);

if (!Number.isFinite(lightRaw)) {
  node.warn('Invalid light payload: missing lightRaw');
  return null;
}

const normalized = {
  kind: 'light_led',
  deviceId: payload.deviceId || 'smartdry-01',
  lightRaw,
  dark,
  ledOn,
  stateChanged: Boolean(payload.stateChanged),
  espTimestamp: payload.timestamp || null,
  serverTime: now
};

flow.set('latestLight', normalized);

msg.payload = normalized;
msg.firestore = {
  collection: 'device_events',
  document: normalized
};

return msg;

