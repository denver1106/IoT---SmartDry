// Task 4 - 24127493
// Purpose: collect all normalized data and prepare a Firebase document.
// This flow also stores recent data in Node-RED context so the dashboard can
// run before Firebase credentials are configured.

const firestore = msg.firestore || {};
const collection = firestore.collection || 'device_events';
const document = firestore.document || msg.payload || {};
const now = new Date().toISOString();

const doc = {
  ...document,
  collection,
  serverTime: document.serverTime || now
};

// Keep a local rolling cache for demo dashboard and Task 5 chart.
const key = `${collection}Cache`;
const cache = flow.get(key) || [];
cache.push(doc);
while (cache.length > 100) cache.shift();
flow.set(key, cache);

msg.payload = doc;
msg.firebase = {
  collection,
  document: doc,
  path: `${collection}/{autoId}`
};

return msg;

