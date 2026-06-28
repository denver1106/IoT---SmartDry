// Task 6 - 24127192
// Purpose: prepare Firebase Cloud Messaging payload from a normalized alert.
// The HTTP request node can send this to FCM Legacy endpoint or be replaced
// by an FCM v1 node/service account implementation.

const alert = msg.payload || {};
const serverKey = flow.get('fcmServerKey') || 'REPLACE_WITH_FCM_SERVER_KEY';
const target = flow.get('fcmTarget') || '/topics/smartdry-alerts';

msg.method = 'POST';
msg.url = 'https://fcm.googleapis.com/fcm/send';
msg.headers = {
  'Content-Type': 'application/json',
  Authorization: `key=${serverKey}`
};

msg.payload = {
  to: target,
  priority: 'high',
  notification: {
    title: alert.title || 'SmartDry alert',
    body: alert.message || 'SmartDry has a new alert.'
  },
  data: {
    type: String(alert.type || 'alert'),
    severity: String(alert.severity || 'warning'),
    deviceId: String(alert.deviceId || 'smartdry-01'),
    serverTime: String(alert.serverTime || new Date().toISOString())
  }
};

msg.firestore = {
  collection: 'alerts',
  document: {
    ...alert,
    sentFcm: true,
    fcmTarget: target,
    fcmPreparedAt: new Date().toISOString()
  }
};

return msg;

