// Node-RED Function - Task 4 - 24127493
// Muc dich: chuan hoa log truoc khi ghi Firestore.
// Dat node nay truoc Firestore ADD node.

const p = msg.payload || {};
const kind = p.isRaining !== undefined
  ? 'rain'
  : p.state || p.action
    ? 'rack'
    : p.lightRaw !== undefined
      ? 'light'
      : 'environment';

msg.collection = kind === 'rack' ? 'rack_events' : 'sensor_logs';
msg.payload = {
  ...p,
  kind,
  serverTime: new Date().toISOString()
};

return msg;

