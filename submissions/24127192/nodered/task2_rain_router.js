// Node-RED Function - Task 2 - 24127192
// Input: msg.payload tu topic smartdry/sensor/rain
// Output 1: dashboard
// Output 2: alert router cho FCM/email khi co mua

const p = msg.payload || {};

msg.payload = {
  type: 'rain',
  severity: p.isRaining ? 'warning' : 'info',
  message: p.isRaining
    ? `Phat hien mua (${p.rainPercent}%). Nen thu sao phoi.`
    : 'Khong mua.',
  rainPercent: Number(p.rainPercent || 0),
  isRaining: Boolean(p.isRaining),
  deviceId: p.deviceId || 'smartdry-01',
  timestamp: p.timestamp || Date.now()
};

if (msg.payload.isRaining) {
  return [msg, RED.util.cloneMessage(msg)];
}

return [msg, null];

