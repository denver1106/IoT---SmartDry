// Task 12 monitor - 24127493
// Input MQTT: smartdry/system/heartbeat or smartdry/system/wifi
// Purpose: record WiFi/config-portal related status from ESP32.

const payload = msg.payload || {};
const now = new Date().toISOString();

const normalized = {
  kind: 'wifi_status',
  deviceId: payload.deviceId || 'smartdry-01',
  status: payload.status || 'online',
  wifiRSSI: payload.wifiRSSI ?? null,
  uptime: payload.uptime ?? null,
  freeHeap: payload.freeHeap ?? null,
  portalMode: Boolean(payload.portalMode),
  ip: payload.ip || null,
  espTimestamp: payload.timestamp || null,
  serverTime: now
};

flow.set('latestWifi', normalized);

msg.payload = normalized;
msg.firestore = {
  collection: 'device_events',
  document: normalized
};

return msg;

