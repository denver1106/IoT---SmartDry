// Task 2 - 24127192
// Input MQTT: smartdry/sensor/rain
// Purpose: normalize rain sensor data for dashboard, Firebase, and alert routing.

const payload = msg.payload || {};
const now = new Date().toISOString();

const raw = Number(payload.raw);
const rainPercent = Number(payload.rainPercent);
const isRaining = Boolean(payload.isRaining);

if (!Number.isFinite(raw) || !Number.isFinite(rainPercent)) {
  node.warn('Invalid rain payload: missing raw/rainPercent');
  return null;
}

const normalized = {
  kind: 'rain',
  deviceId: payload.deviceId || 'smartdry-01',
  raw,
  rainPercent,
  isRaining,
  stateChanged: Boolean(payload.stateChanged),
  espTimestamp: payload.timestamp || null,
  serverTime: now
};

flow.set('latestRain', normalized);

msg.payload = normalized;
msg.firestore = {
  collection: isRaining ? 'rain_events' : 'sensor_logs',
  document: normalized
};

return msg;

