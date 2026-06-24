// Node-RED Function - Task 6 - 24127192
// Muc dich: chuyen alert noi bo thanh payload cho FCM.
// Vi sao tach rieng: FCM la thong bao nhanh, khac voi email o Task 7.

const alert = msg.payload || {};

msg.payload = {
  notification: {
    title: 'SmartDry canh bao',
    body: alert.message || 'Co canh bao moi tu SmartDry.'
  },
  data: {
    type: String(alert.type || 'alert'),
    severity: String(alert.severity || 'warning'),
    deviceId: String(alert.deviceId || 'smartdry-01'),
    createdAt: new Date().toISOString()
  }
};

return msg;

