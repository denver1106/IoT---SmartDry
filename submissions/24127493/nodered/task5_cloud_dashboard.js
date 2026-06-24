// Node-RED Function - Task 5 - 24127493
// Muc dich: chuyen du lieu doc tu Firestore thanh dataset cho dashboard.
// Dat node nay sau Firestore GET/LIST node.

const rows = Array.isArray(msg.payload) ? msg.payload : [];

const latest = rows[rows.length - 1] || {};

msg.payload = {
  latest,
  temperatureSeries: rows
    .filter((row) => row.temperature !== undefined)
    .map((row) => ({ x: row.serverTime || row.timestamp, y: Number(row.temperature) })),
  humiditySeries: rows
    .filter((row) => row.humidity !== undefined)
    .map((row) => ({ x: row.serverTime || row.timestamp, y: Number(row.humidity) })),
  rainSeries: rows
    .filter((row) => row.rainPercent !== undefined)
    .map((row) => ({ x: row.serverTime || row.timestamp, y: Number(row.rainPercent) }))
};

return msg;

