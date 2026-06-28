// Task 7 - 24127192
// Purpose: prepare email alert payload. The email node reads msg.to,
// msg.topic, and msg.payload.

const alert = msg.payload || {};
const receiver = flow.get('alertEmail') || 'receiver@example.com';

msg.to = receiver;
msg.topic = `[SmartDry] ${alert.severity || 'warning'} - ${alert.title || alert.type || 'alert'}`;
msg.payload = [
  alert.message || 'SmartDry has a new alert.',
  '',
  `Device: ${alert.deviceId || 'smartdry-01'}`,
  `Severity: ${alert.severity || 'warning'}`,
  `Source: ${alert.source || 'node-red'}`,
  `Time: ${alert.serverTime || new Date().toLocaleString('vi-VN')}`,
  '',
  'Open the Node-RED SmartDry dashboard for details.'
].join('\n');

msg.firestore = {
  collection: 'alerts',
  document: {
    ...alert,
    sentEmail: true,
    emailTo: receiver,
    emailPreparedAt: new Date().toISOString()
  }
};

return msg;

