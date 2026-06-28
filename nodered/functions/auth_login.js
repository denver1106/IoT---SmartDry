// Task 9 - 24127192
// Input: HTTP POST /smartdry/api/login with { username, password }.
// Purpose: demo login using flow context. In production, replace accounts with
// Firestore collection accounts and compare passwordHash.

const body = msg.payload || {};
const username = String(body.username || '').trim();
const password = String(body.password || '');

if (!username || !password) {
  msg.statusCode = 400;
  msg.payload = {
    ok: false,
    error: 'missing_credentials'
  };
  return msg;
}

// Demo accounts mirror FireBase/sample_data.json.
// Password kept here only for local Node-RED demo; Firebase design stores hash.
const accounts = flow.get('demoAccounts') || {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    displayName: 'SmartDry Admin'
  },
  operator: {
    username: 'operator',
    password: 'smartdry123',
    role: 'operator',
    displayName: 'SmartDry Operator'
  }
};

const account = accounts[username];
if (!account || account.password !== password) {
  msg.statusCode = 401;
  msg.payload = {
    ok: false,
    error: 'invalid_credentials'
  };
  return msg;
}

const session = {
  username: account.username,
  role: account.role,
  displayName: account.displayName,
  loggedInAt: new Date().toISOString()
};

flow.set('currentUser', session);

msg.statusCode = 200;
msg.payload = {
  ok: true,
  user: session
};

return msg;

