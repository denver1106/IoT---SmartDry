// Task basic input -> web - 24127192
// Input MQTT: smartdry/sensor/environment
// Purpose: validate DHT payload, update latest device state, and create a document
// that can be logged to Firebase sensor_logs.

const payload = msg.payload || {};
const now = new Date().toISOString();

const temperature = Number(payload.temperature);
const humidity = Number(payload.humidity);
const heatIndex = Number(payload.heatIndex || temperature);

if (!Number.isFinite(temperature) || !Number.isFinite(humidity)) {
  node.warn('Invalid environment payload: missing temperature/humidity');
  return null;
}

const normalized = {
  kind: 'environment',
  deviceId: payload.deviceId || 'smartdry-01',
  temperature,
  humidity,
  heatIndex,
  espTimestamp: payload.timestamp || null,
  serverTime: now
};

flow.set('latestEnvironment', normalized);

msg.payload = normalized;
msg.firestore = {
  collection: 'sensor_logs',
  document: normalized
};

return msg;

