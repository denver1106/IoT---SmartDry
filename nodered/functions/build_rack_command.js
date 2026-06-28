// Basic web -> output - 24127493
// Input: HTTP POST /smartdry/api/rack or dashboard button payload.
// Purpose: validate user command and publish a clean MQTT payload to ESP32.

const body = msg.payload || {};
const action = String(body.action || '').toLowerCase();
const allowed = ['extend', 'retract', 'stop'];

if (!allowed.includes(action)) {
  msg.statusCode = 400;
  msg.payload = {
    ok: false,
    error: 'invalid_action',
    allowed
  };
  return [null, msg];
}

const user = flow.get('currentUser') || { username: 'local-demo', role: 'operator' };
const command = {
  action,
  source: body.source || 'node-red-web',
  requestedBy: user.username,
  requestId: `rack-${Date.now()}`,
  serverTime: new Date().toISOString()
};

msg.topic = 'smartdry/rack/control';
msg.payload = command;
msg.firestore = {
  collection: 'commands',
  document: command
};

const response = RED.util.cloneMessage(msg);
response.statusCode = 200;
response.payload = {
  ok: true,
  command
};

return [msg, response];

