// Task 2 -> Task 6/7 bridge - 24127192
// Purpose: create an alert only when the rain sensor reports rain.
// Output 1: normal rain data for dashboard/logging
// Output 2: alert for FCM/email

const rain = msg.payload || {};

if (!rain.isRaining) {
  return [msg, null];
}

const alert = {
  type: 'rain',
  severity: rain.rainPercent >= 70 ? 'critical' : 'warning',
  title: 'SmartDry phat hien mua',
  message: `Cam bien mua bao ${rain.rainPercent}%. Nen thu sao phoi ngay.`,
  deviceId: rain.deviceId || 'smartdry-01',
  source: 'rain_sensor',
  serverTime: new Date().toISOString(),
  data: {
    rainPercent: rain.rainPercent,
    raw: rain.raw
  }
};

const alertMsg = RED.util.cloneMessage(msg);
alertMsg.payload = alert;
alertMsg.firestore = {
  collection: 'alerts',
  document: {
    ...alert,
    sentFcm: false,
    sentEmail: false
  }
};

return [msg, alertMsg];

