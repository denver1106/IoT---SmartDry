// Node-RED Function - Task 9 - 24127192
// Muc dich: skeleton xu ly dang nhap va bao ve dashboard.
//
// Goi y flow:
// Login form -> function nay -> Firestore get accounts -> Compare passwordHash
// Neu thanh cong: flow.set('authenticated', true)
// Neu that bai: khong cho publish lenh rack/control.

const body = msg.payload || {};

if (!body.username || !body.password) {
  msg.payload = {
    authenticated: false,
    reason: 'missing_credentials',
    message: 'Vui long nhap username va password.'
  };
  return [null, msg];
}

// Khong luu password plain text. Buoc tiep theo can hash password va so sanh voi Firestore.
msg.accountQuery = {
  collection: 'accounts',
  field: 'username',
  operator: '==',
  value: body.username
};

msg.passwordToVerify = body.password;
msg.payload = {
  username: body.username,
  next: 'query_firestore_accounts'
};

return [msg, null];

