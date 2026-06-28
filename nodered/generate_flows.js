const fs = require('fs');
const path = require('path');

const root = __dirname;
const fn = (name) => fs.readFileSync(path.join(root, 'functions', name), 'utf8');

let x = 0;
const id = (prefix) => `${prefix}_${++x}`;

const flows = [];
const add = (node) => {
  flows.push(node);
  return node.id;
};

const tab = (id, label, info) => add({ id, type: 'tab', label, disabled: false, info });

const tabs = {
  config: 'tab_config',
  ingest: 'tab_ingest',
  control: 'tab_control',
  alerts: 'tab_alerts',
  auth: 'tab_auth',
  dashboard: 'tab_dashboard',
  cloud: 'tab_cloud',
  sim: 'tab_sim'
};

tab(tabs.config, '00 Config - SmartDry Node-RED', 'Config and overview for all SmartDry tasks.');
tab(tabs.ingest, '01 Ingest Sensors - Task 1/2/12', 'Receive MQTT telemetry from ESP32 and normalize it.');
tab(tabs.control, '02 Rack Control - Web to Output', 'Node-RED web command to ESP32 motor output.');
tab(tabs.alerts, '03 Alerts - Task 6/7', 'FCM and Email alert preparation.');
tab(tabs.auth, '04 Auth - Task 9', 'Login and access guard.');
tab(tabs.dashboard, '05 Web Dashboard - Task 5', 'Node-RED HTTP dashboard and APIs.');
tab(tabs.cloud, '06 Firebase Adapter - Task 4/5', 'Prepare Firestore documents and local cache.');
tab(tabs.sim, '07 Simulators - Dev/Test', 'Inject sample MQTT payloads without ESP32.');

// Config node for MQTT.
add({
  id: 'mqtt_local',
  type: 'mqtt-broker',
  name: 'Local MQTT 1883',
  broker: '127.0.0.1',
  port: '1883',
  clientid: '',
  autoConnect: true,
  usetls: false,
  protocolVersion: '4',
  keepalive: '60',
  cleansession: true,
  birthTopic: '',
  birthQos: '0',
  birthPayload: '',
  closeTopic: '',
  closeQos: '0',
  closePayload: '',
  willTopic: '',
  willQos: '0',
  willPayload: ''
});

const comment = (z, name, info, px, py) => add({
  id: id('comment'),
  type: 'comment',
  z,
  name,
  info,
  x: px,
  y: py,
  wires: []
});

const functionNode = (z, name, func, outputs, px, py, wires = []) => add({
  id: id('fn'),
  type: 'function',
  z,
  name,
  func,
  outputs,
  timeout: 0,
  noerr: 0,
  initialize: '',
  finalize: '',
  libs: [],
  x: px,
  y: py,
  wires
});

const jsonNode = (z, name, px, py, wires) => add({
  id: id('json'),
  type: 'json',
  z,
  name,
  property: 'payload',
  action: '',
  pretty: false,
  x: px,
  y: py,
  wires
});

const debugNode = (z, name, px, py) => add({
  id: id('debug'),
  type: 'debug',
  z,
  name,
  active: true,
  tosidebar: true,
  console: false,
  tostatus: false,
  complete: 'payload',
  targetType: 'msg',
  x: px,
  y: py,
  wires: []
});

const linkOut = (z, name, links, px, py) => add({
  id: id('link_out'),
  type: 'link out',
  z,
  name,
  mode: 'link',
  links,
  x: px,
  y: py,
  wires: []
});

const linkIn = (z, name, links, px, py, wires) => add({
  id: id('link_in'),
  type: 'link in',
  z,
  name,
  links,
  x: px,
  y: py,
  wires
});

const mqttIn = (z, name, topic, px, py, wires) => add({
  id: id('mqtt_in'),
  type: 'mqtt in',
  z,
  name,
  topic,
  qos: '0',
  datatype: 'auto',
  broker: 'mqtt_local',
  nl: false,
  rap: true,
  rh: 0,
  inputs: 0,
  x: px,
  y: py,
  wires
});

const mqttOut = (z, name, topic, px, py) => add({
  id: id('mqtt_out'),
  type: 'mqtt out',
  z,
  name,
  topic,
  qos: '',
  retain: '',
  respTopic: '',
  contentType: '',
  userProps: '',
  correl: '',
  expiry: '',
  broker: 'mqtt_local',
  x: px,
  y: py,
  wires: []
});

const httpIn = (z, name, method, url, px, py, wires) => add({
  id: id('http_in'),
  type: 'http in',
  z,
  name,
  url,
  method,
  upload: false,
  swaggerDoc: '',
  x: px,
  y: py,
  wires
});

const httpResponse = (z, name, px, py) => add({
  id: id('http_response'),
  type: 'http response',
  z,
  name,
  statusCode: '',
  headers: {},
  x: px,
  y: py,
  wires: []
});

const templateNode = (z, name, template, px, py, wires) => add({
  id: id('template'),
  type: 'template',
  z,
  name,
  field: 'payload',
  fieldType: 'msg',
  format: 'handlebars',
  syntax: 'mustache',
  template,
  output: 'str',
  x: px,
  y: py,
  wires
});

const inject = (z, name, payload, px, py, wires) => add({
  id: id('inject'),
  type: 'inject',
  z,
  name,
  props: [{ p: 'payload' }],
  repeat: '',
  crontab: '',
  once: false,
  onceDelay: 0.1,
  topic: '',
  payload: JSON.stringify(payload),
  payloadType: 'json',
  x: px,
  y: py,
  wires
});

// Link IDs.
const cloudInId = 'cloud_all_in';
const alertInId = 'alert_all_in';

comment(
  tabs.config,
  'Task mapping',
  [
    '24127192: Task 2 rain -> web, Task 6 FCM, Task 7 email, Task 9 login/security.',
    '24127493: Task 1 LDR -> LED monitor, Task 4 cloud logs, Task 5 cloud -> web, Task 12 WiFi monitor.',
    'MQTT broker defaults to 127.0.0.1:1883. Change mqtt_local when broker runs elsewhere.'
  ].join('\\n'),
  260,
  120
);

// Ingest tab.
const cloudLinkIds = [];
const alertLinkIds = [];

function wireTelemetry({ name, topic, normalizer, y, extraAlert = false }) {
  const outToCloud = `cloud_${name}`;
  cloudLinkIds.push(outToCloud);
  const cloudOut = add({
    id: outToCloud,
    type: 'link out',
    z: tabs.ingest,
    name: `${name} -> Firebase adapter`,
    mode: 'link',
    links: [cloudInId],
    x: 980,
    y,
    wires: []
  });
  const dbg = debugNode(tabs.ingest, `${name} normalized`, 980, y + 40);
  const fnId = functionNode(tabs.ingest, normalizer.label, fn(normalizer.file), normalizer.outputs || 1, 650, y, normalizer.outputs === 2 ? [[cloudOut, dbg], []] : [[cloudOut, dbg]]);
  const jsonId = jsonNode(tabs.ingest, `Parse ${name}`, 390, y, [[fnId]]);
  mqttIn(tabs.ingest, topic, topic, 160, y, [[jsonId]]);
  return fnId;
}

comment(tabs.ingest, 'Ingest from ESP32', 'Every MQTT payload is parsed, normalized, cached for dashboard, then sent to the Firebase adapter.', 300, 40);
wireTelemetry({ name: 'environment', topic: 'smartdry/sensor/environment', normalizer: { label: 'Normalize Environment', file: 'normalize_environment.js' }, y: 110 });

// Rain has an additional alert branch.
const rainCloudOut = 'cloud_rain';
const rainAlertOut = 'alert_rain';
cloudLinkIds.push(rainCloudOut);
alertLinkIds.push(rainAlertOut);
add({ id: rainCloudOut, type: 'link out', z: tabs.ingest, name: 'rain -> Firebase adapter', mode: 'link', links: [cloudInId], x: 1050, y: 210, wires: [] });
add({ id: rainAlertOut, type: 'link out', z: tabs.ingest, name: 'rain alert -> alerts', mode: 'link', links: [alertInId], x: 1050, y: 250, wires: [] });
const rainAlertFn = functionNode(tabs.ingest, 'Build Rain Alert', fn('build_rain_alert.js'), 2, 770, 220, [[rainCloudOut], [rainAlertOut]]);
const rainNormFn = functionNode(tabs.ingest, 'Normalize Rain', fn('normalize_rain.js'), 1, 540, 220, [[rainAlertFn]]);
const rainJson = jsonNode(tabs.ingest, 'Parse rain', 320, 220, [[rainNormFn]]);
mqttIn(tabs.ingest, 'smartdry/sensor/rain', 'smartdry/sensor/rain', 130, 220, [[rainJson]]);

wireTelemetry({ name: 'light_status', topic: 'smartdry/task1/light-led', normalizer: { label: 'Normalize Light Status', file: 'normalize_light_status.js' }, y: 340 });
wireTelemetry({ name: 'rack_status', topic: 'smartdry/rack/status', normalizer: { label: 'Normalize Rack Status', file: 'normalize_rack_status.js' }, y: 450 });
wireTelemetry({ name: 'wifi_status', topic: 'smartdry/system/heartbeat', normalizer: { label: 'Normalize WiFi/Heartbeat', file: 'normalize_wifi_status.js' }, y: 560 });

// Control tab.
comment(tabs.control, 'Rack control', 'HTTP /smartdry/api/rack requires login, then publishes command to smartdry/rack/control and logs the command.', 300, 50);
const rackMqttOut = mqttOut(tabs.control, '-> smartdry/rack/control', 'smartdry/rack/control', 960, 150);
const rackCloudOut = 'cloud_rack_command';
cloudLinkIds.push(rackCloudOut);
add({ id: rackCloudOut, type: 'link out', z: tabs.control, name: 'rack command -> Firebase adapter', mode: 'link', links: [cloudInId], x: 970, y: 200, wires: [] });
const rackResponse = httpResponse(tabs.control, 'Rack API response', 960, 250);
const rackCommandFn = functionNode(tabs.control, 'Build Rack Command', fn('build_rack_command.js'), 2, 690, 190, [[rackMqttOut, rackCloudOut], [rackResponse]]);
const rackGuardReject = httpResponse(tabs.control, 'Unauthorized response', 690, 260);
const rackGuard = functionNode(tabs.control, 'Auth Guard Before Rack Command', fn('auth_guard_rack.js'), 2, 450, 190, [[rackCommandFn], [rackGuardReject]]);
const rackJson = jsonNode(tabs.control, 'Parse Rack POST JSON', 250, 190, [[rackGuard]]);
httpIn(tabs.control, 'POST /smartdry/api/rack', 'post', '/smartdry/api/rack', 120, 190, [[rackJson]]);

// Auth tab.
comment(tabs.auth, 'Login/security', 'Demo login uses flow context. Firebase design stores passwordHash in accounts collection.', 300, 60);
const loginResponse = httpResponse(tabs.auth, 'Login response', 720, 150);
const loginFn = functionNode(tabs.auth, 'Login User', fn('auth_login.js'), 1, 500, 150, [[loginResponse]]);
const loginJson = jsonNode(tabs.auth, 'Parse Login JSON', 290, 150, [[loginFn]]);
httpIn(tabs.auth, 'POST /smartdry/api/login', 'post', '/smartdry/api/login', 130, 150, [[loginJson]]);

// Dashboard tab.
comment(tabs.dashboard, 'Node-RED web frontend', 'Open http://localhost:1880/smartdry after deploying. It uses Node-RED HTTP nodes, so no Dashboard package is required.', 360, 50);
const dashboardResponse = httpResponse(tabs.dashboard, 'Dashboard HTML response', 650, 140);
const dashboardTpl = templateNode(tabs.dashboard, 'SmartDry dashboard HTML', fn('smartdry_dashboard_template.html'), 420, 140, [[dashboardResponse]]);
httpIn(tabs.dashboard, 'GET /smartdry', 'get', '/smartdry', 170, 140, [[dashboardTpl]]);
const statusResponse = httpResponse(tabs.dashboard, 'Status API response', 650, 240);
const statusFn = functionNode(tabs.dashboard, 'Build Dashboard Status', fn('dashboard_status.js'), 1, 420, 240, [[statusResponse]]);
httpIn(tabs.dashboard, 'GET /smartdry/api/status', 'get', '/smartdry/api/status', 170, 240, [[statusFn]]);

// Alerts tab.
comment(tabs.alerts, 'Task 6 and Task 7', 'Alerts come from rain/rack rules. FCM and email are prepared here; connect real FCM/email nodes after credentials are set.', 360, 50);
const alertCloudOut = 'cloud_alert_raw';
cloudLinkIds.push(alertCloudOut);
add({ id: alertCloudOut, type: 'link out', z: tabs.alerts, name: 'alert -> Firebase adapter', mode: 'link', links: [cloudInId], x: 770, y: 125, wires: [] });
const fcmDebug = debugNode(tabs.alerts, 'FCM payload ready', 780, 190);
const emailDebug = debugNode(tabs.alerts, 'Email payload ready', 780, 260);
const fcmFn = functionNode(tabs.alerts, 'Task 6 Build FCM Payload', fn('build_fcm_payload.js'), 1, 520, 190, [[fcmDebug]]);
const emailFn = functionNode(tabs.alerts, 'Task 7 Build Email Payload', fn('build_email_payload.js'), 1, 520, 260, [[emailDebug]]);
linkIn(tabs.alerts, 'All alerts in', alertLinkIds, 140, 190, [[alertCloudOut, fcmFn, emailFn]]);

// Cloud tab.
comment(tabs.cloud, 'Task 4/5 Firebase adapter', 'The function creates msg.firebase.collection/document. Replace debug with Firestore ADD/SET nodes when Firebase credentials are configured.', 410, 50);
const cloudDebug = debugNode(tabs.cloud, 'Firestore document ready', 750, 160);
const cloudFn = functionNode(tabs.cloud, 'Task 4 Build Firestore Document', fn('build_firestore_document.js'), 1, 470, 160, [[cloudDebug]]);
add({ id: cloudInId, type: 'link in', z: tabs.cloud, name: 'All normalized docs', links: cloudLinkIds, x: 160, y: 160, wires: [[cloudFn]] });

// Simulator tab.
comment(tabs.sim, 'Development simulators', 'Use these inject nodes to test Node-RED without ESP32 hardware.', 310, 50);
function sim(name, topic, payload, y) {
  const out = mqttOut(tabs.sim, `-> ${topic}`, topic, 560, y);
  inject(tabs.sim, name, payload, 220, y, [[out]]);
}
sim('Sim environment', 'smartdry/sensor/environment', { deviceId: 'smartdry-01', temperature: 30.5, humidity: 67, heatIndex: 34.2, timestamp: 1000 }, 120);
sim('Sim rain dry', 'smartdry/sensor/rain', { deviceId: 'smartdry-01', raw: 3200, rainPercent: 12, isRaining: false, stateChanged: false, timestamp: 1000 }, 180);
sim('Sim rain wet alert', 'smartdry/sensor/rain', { deviceId: 'smartdry-01', raw: 1200, rainPercent: 78, isRaining: true, stateChanged: true, timestamp: 1000 }, 240);
sim('Sim light -> LED', 'smartdry/task1/light-led', { deviceId: 'smartdry-01', lightRaw: 2850, dark: true, ledOn: true, stateChanged: true, timestamp: 1000 }, 300);
sim('Sim rack status', 'smartdry/rack/status', { deviceId: 'smartdry-01', state: 'retracted', target: 'retract', motorRunning: false, reason: 'limit_retracted', timestamp: 1000 }, 360);
sim('Sim heartbeat', 'smartdry/system/heartbeat', { deviceId: 'smartdry-01', status: 'online', wifiRSSI: -52, uptime: 120, freeHeap: 160000, portalMode: false, timestamp: 1000 }, 420);

fs.writeFileSync(path.join(root, 'flows.json'), JSON.stringify(flows, null, 2) + '\n');
console.log(`Generated ${flows.length} Node-RED nodes into nodered/flows.json`);
