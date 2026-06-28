// Task 9 - 24127192
// Purpose: block web-to-output rack commands when no user is logged in.
// Output 1: allowed command
// Output 2: HTTP 401 response

const user = flow.get('currentUser');

if (!user) {
  msg.statusCode = 401;
  msg.payload = {
    ok: false,
    error: 'unauthorized',
    message: 'Please login before controlling SmartDry.'
  };
  return [null, msg];
}

return [msg, null];

