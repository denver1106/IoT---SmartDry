// Node-RED Function - Task 7 - 24127192
// Muc dich: tao email canh bao bang Gmail SMTP.
// Luu y: khong dung FCM cho email, day la dich vu thong bao rieng.

const alert = msg.payload || {};
const receiver = flow.get('alertEmail') || 'receiver@example.com';

msg.to = receiver;
msg.topic = `[SmartDry] ${alert.severity || 'warning'} - ${alert.type || 'alert'}`;
msg.payload = [
  alert.message || 'Co canh bao moi tu SmartDry.',
  '',
  `Device: ${alert.deviceId || 'smartdry-01'}`,
  `Severity: ${alert.severity || 'warning'}`,
  `Time: ${new Date().toLocaleString('vi-VN')}`,
  '',
  'Kiem tra dashboard Node-RED de xem chi tiet.'
].join('\n');

return msg;

